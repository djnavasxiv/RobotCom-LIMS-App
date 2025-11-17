import React, { useState, useEffect } from 'react';
import { Patient } from '../../../../domain/entities/Patient';
import { PatientService } from '../../../../application/services/PatientService';
import { useAuthStore } from '../../../../application/state/authStore';
import './PatientSearchForm.css';

interface PatientSearchFormProps {
  onPatientSelect: (patient: Patient) => void;
  selectedPatient: Patient | null;
}

export const PatientSearchForm: React.FC<PatientSearchFormProps> = ({
  onPatientSelect,
  selectedPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { labId } = useAuthStore();

  const patientService = new PatientService();

  // Load all patients on component mount
  useEffect(() => {
    const loadPatients = async () => {
      if (!labId) return;
      setIsLoading(true);
      try {
        const data = await patientService.getPatientsByLab(labId);
        setPatients(data);
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, [labId]);

  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = patients.filter(
        (patient) =>
          `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(query) ||
          patient.phone.value.includes(query)
      );
      setFilteredPatients(filtered);
    }
  }, [searchQuery, patients]);

  const handleSelectPatient = (patient: Patient) => {
    onPatientSelect(patient);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleCreateNewPatient = () => {
    // TODO: Implement create new patient modal
    alert('Create new patient functionality coming soon');
  };

  return (
    <div className="patient-search-form">
      <div className="form-group">
        <label>PACIENTE (Patient)</label>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search patient by name or phone..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="clear-btn"
              onClick={() => {
                setSearchQuery('');
                setShowDropdown(false);
              }}
            >
              ✕
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="dropdown">
            {isLoading ? (
              <div className="dropdown-item loading">Loading patients...</div>
            ) : filteredPatients.length > 0 ? (
              <>
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`dropdown-item ${
                      selectedPatient?.id === patient.id ? 'selected' : ''
                    }`}
                    onClick={() => handleSelectPatient(patient)}
                  >
                    <div className="patient-name">
                      {patient.firstName} {patient.lastName}
                    </div>
                    <div className="patient-info">
                      {patient.phone.value}
                      {patient.email && ` • ${patient.email.value}`}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="dropdown-item empty">No patients found</div>
            )}
            <div className="dropdown-divider"></div>
            <button className="dropdown-item create-new" onClick={handleCreateNewPatient}>
              + Create New Patient
            </button>
          </div>
        )}
      </div>

      {selectedPatient && (
        <div className="patient-details">
          <div className="detail-row">
            <div className="detail-col">
              <label>NOMBRE</label>
              <span>
                {selectedPatient.firstName} {selectedPatient.lastName}
              </span>
            </div>
            <div className="detail-col">
              <label>EDAD</label>
              <span>{selectedPatient.getAge()} años</span>
            </div>
            <div className="detail-col">
              <label>GENERO</label>
              <span>{selectedPatient.gender === 'male' ? 'M' : 'F'}</span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-col">
              <label>TEL.</label>
              <span>{selectedPatient.phone.value}</span>
            </div>
            <div className="detail-col">
              <label>EMAIL</label>
              <span>{selectedPatient.email?.value || 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
