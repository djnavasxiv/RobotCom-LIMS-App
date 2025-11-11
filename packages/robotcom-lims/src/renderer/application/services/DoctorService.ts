import { Doctor } from '../../domain/entities/Doctor';
import { IDoctorRepository } from '../../domain/interfaces/IDoctorRepository';
import { DoctorRepository } from '../../data/repositories/DoctorRepository';

export class DoctorService {
  private doctorRepository: IDoctorRepository;

  constructor() {
    this.doctorRepository = new DoctorRepository();
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return this.doctorRepository.findAll();
  }

  async createDoctor(data: any): Promise<Doctor> {
    const doctor = Doctor.create({ ...data, isActive: true });
    return this.doctorRepository.create(doctor);
  }

  async updateDoctor(id: string, data: any): Promise<Doctor> {
    const doctor = await this.doctorRepository.findById(id);
    if (!doctor) throw new Error('Doctor not found');

    const updatedDoctor = Doctor.create({ ...doctor, ...data }, id);
    return this.doctorRepository.update(updatedDoctor);
  }

  async deleteDoctor(id: string): Promise<void> {
    return this.doctorRepository.delete(id);
  }
}
