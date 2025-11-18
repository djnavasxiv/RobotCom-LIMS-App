import React, { useState } from 'react';
import SecurityService from '@services/SecurityService';
import LoggerService from '@services/LoggerService';

interface PatientFormProps {
  patient?: any;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ patient, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    birthDate: patient?.birthDate ? new Date(patient.birthDate).toISOString().split('T')[0] : '',
    gender: patient?.gender || 'male',
    address: patient?.address || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear security error for this field when user starts typing
    if (securityErrors[name]) {
      setSecurityErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSecurityErrors({});

    try {
      // Validate form data for security issues
      const emailValidation = SecurityService.validateEmail(formData.email);
      const phoneValidation = SecurityService.validatePhone(formData.phone);
      const firstNameValidation = SecurityService.validateName(formData.firstName, 'Nombre');
      const lastNameValidation = SecurityService.validateName(formData.lastName, 'Apellido');
      const dateValidation = SecurityService.validateDate(formData.birthDate, 'Fecha de nacimiento');

      const validationErrors: Record<string, string> = {};
      if (!emailValidation.isValid) validationErrors.email = emailValidation.errors[0];
      if (!phoneValidation.isValid) validationErrors.phone = phoneValidation.errors[0];
      if (!firstNameValidation.isValid) validationErrors.firstName = firstNameValidation.errors[0];
      if (!lastNameValidation.isValid) validationErrors.lastName = lastNameValidation.errors[0];
      if (!dateValidation.isValid) validationErrors.birthDate = dateValidation.errors[0];

      if (Object.keys(validationErrors).length > 0) {
        setSecurityErrors(validationErrors);
        LoggerService.warn('Form validation failed', validationErrors);
        setLoading(false);
        return;
      }

      // Sanitize form data before submitting
      const sanitizedData = {
        ...formData,
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\D/g, ''),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        address: formData.address.trim(),
      };

      LoggerService.info('Submitting patient form', { 
        isUpdate: !!patient, 
        patientId: patient?.id 
      });

      await onSave(sanitizedData);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el paciente';
      LoggerService.error('Failed to save patient', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {patient ? 'Editar Paciente' : 'Agregar Nuevo Paciente'}
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {Object.keys(securityErrors).length > 0 && (
          <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p className="font-semibold">Por favor, revise los siguientes campos:</p>
            <ul className="list-disc ml-5 mt-2">
              {Object.values(securityErrors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  securityErrors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {securityErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{securityErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  securityErrors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {securityErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{securityErrors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  securityErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {securityErrors.email && (
                <p className="text-red-500 text-sm mt-1">{securityErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  securityErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {securityErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{securityErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  securityErrors.birthDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {securityErrors.birthDate && (
                <p className="text-red-500 text-sm mt-1">{securityErrors.birthDate}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-4 justify-end pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
