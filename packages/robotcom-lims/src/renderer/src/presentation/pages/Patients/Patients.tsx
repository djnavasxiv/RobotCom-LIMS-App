import React, { useEffect, useState } from 'react';
import { PatientService } from '../../../../application/services/PatientService';
import { useAuthStore } from '../../../../application/state/authStore';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'male' as 'male' | 'female' | 'other',
    address: ''
  });

  const patientService = new PatientService();
  const { labId } = useAuthStore();

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients();
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientService.getPatientsByLab(labId || 'default-lab-id');
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPatients = () => {
    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = patients.filter(p => 
      p.firstName?.toLowerCase().includes(term) ||
      p.lastName?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      p.phone?.toLowerCase().includes(term)
    );
    setFilteredPatients(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patientService.createPatient({
        ...formData,
        birthDate: new Date(formData.birthDate),
        labId: labId || 'default-lab-id'
      });
      setShowForm(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'male',
        address: ''
      });
      loadPatients();
    } catch (error) {
      console.error('Error creating patient:', error);
      alert('Error al crear el paciente');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem' }}>Cargando pacientes...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Gestión de Pacientes</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: '#3498db', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {showForm ? 'Cancelar' : 'Agregar Nuevo Paciente'}
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar pacientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '0.5rem', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Agregar Nuevo Paciente</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <input
              type="text"
              placeholder="Nombre"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="text"
              placeholder="Apellido"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="tel"
              placeholder="Teléfono"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <input
              type="date"
              required
              value={formData.birthDate}
              onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
            </select>
            <input
              type="text"
              placeholder="Dirección"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', gridColumn: '1 / -1' }}
            />
            <button type="submit" style={{ padding: '0.5rem 1rem', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', gridColumn: '1 / -1' }}>
              Guardar Paciente
            </button>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f8f9fa' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Nombre</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Correo</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Teléfono</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Fecha de Nacimiento</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Género</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '1rem' }}>{patient.firstName} {patient.lastName}</td>
                  <td style={{ padding: '1rem' }}>{patient.email || '-'}</td>
                  <td style={{ padding: '1rem' }}>{patient.phone || '-'}</td>
                  <td style={{ padding: '1rem' }}>{patient.birthDate ? new Date(patient.birthDate).toLocaleDateString() : '-'}</td>
                  <td style={{ padding: '1rem' }}>{patient.gender}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#7f8c8d' }}>
                  No se encontraron pacientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
