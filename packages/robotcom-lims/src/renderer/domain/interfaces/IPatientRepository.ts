import { Patient } from '../entities/Patient';

export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>;
  findByLabId(labId: string): Promise<Patient[]>;
  create(entity: Patient): Promise<Patient>;
  update(entity: Patient): Promise<Patient>;
  delete(id: string): Promise<void>;
  search(labId: string, query: string): Promise<Patient[]>;
}
