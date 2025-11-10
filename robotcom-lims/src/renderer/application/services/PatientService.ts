import { IPatientRepository } from '../../domain/interfaces/IPatientRepository';
import { Patient } from '../../domain/entities/Patient';
import { Email } from '../../domain/value-objects/Email';
import { Phone } from '../../domain/value-objects/Phone';
import { PatientRepository } from '../../data/repositories/PatientRepository';

export class PatientService {
  private patientRepository: IPatientRepository;

  constructor() {
    // The repository is self-contained and uses the electronAPI bridge.
    this.patientRepository = new PatientRepository();
  }

  async createPatient(data: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    birthDate: Date;
    gender: 'male' | 'female' | 'other';
    address?: string;
    labId: string;
  }): Promise<Patient> {
    // Validate and create value objects
    const phone = Phone.create(data.phone);
    const email = data.email ? Email.create(data.email) : undefined;

    // Create entity
    const patient = Patient.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email,
      phone,
      birthDate: data.birthDate,
      gender: data.gender,
      address: data.address,
      labId: data.labId
    });

    // Persist to database
    return await this.patientRepository.create(patient);
  }

  async getPatientById(id: string): Promise<Patient | null> {
    return await this.patientRepository.findById(id);
  }

  async getPatientsByLab(labId: string): Promise<Patient[]> {
    return await this.patientRepository.findByLabId(labId);
  }

  async searchPatients(labId: string, query: string): Promise<Patient[]> {
    return await this.patientRepository.search(labId, query);
  }

  async updatePatient(id: string, data: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
  }>): Promise<Patient> {
    const patient = await this.patientRepository.findById(id);
    if (!patient) {
      throw new Error('Patient not found');
    }

    if (data.email || data.phone) {
      const email = data.email ? Email.create(data.email) : patient.email;
      const phone = data.phone ? Phone.create(data.phone) : patient.phone;
      patient.updateContactInfo(email, phone);
    }

    if (data.address) {
      patient.updateAddress(data.address);
    }

    return await this.patientRepository.update(patient);
  }

  async deletePatient(id: string): Promise<void> {
    await this.patientRepository.delete(id);
  }
}
