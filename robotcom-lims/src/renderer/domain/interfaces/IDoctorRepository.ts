import { Doctor } from '../entities/Doctor';

export interface IDoctorRepository {
  findAll(): Promise<Doctor[]>;
  findById(id: string): Promise<Doctor | null>;
  create(entity: Doctor): Promise<Doctor>;
  update(entity: Doctor): Promise<Doctor>;
  delete(id: string): Promise<void>;
}
