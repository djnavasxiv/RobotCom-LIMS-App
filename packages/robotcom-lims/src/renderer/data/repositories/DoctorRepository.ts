import { Doctor } from '../../domain/entities/Doctor';
import { IDoctorRepository } from '../../domain/interfaces/IDoctorRepository';

export class DoctorRepository implements IDoctorRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('doctor', method, ...args);
    if (!success) throw new Error(error || 'Database query failed');
    return data;
  }

  async findAll(): Promise<Doctor[]> {
    const data = await this.query('findMany');
    return data.map(d => Doctor.create(d, d.id));
  }

  async findById(id: string): Promise<Doctor | null> {
    const data = await this.query('findUnique', { where: { id } });
    return data ? Doctor.create(data, data.id) : null;
  }

  async create(entity: Doctor): Promise<Doctor> {
    const data = await this.query('create', { data: this.toPersistence(entity) });
    return Doctor.create(data, data.id);
  }

  async update(entity: Doctor): Promise<Doctor> {
    const data = await this.query('update', { where: { id: entity.id }, data: this.toPersistence(entity) });
    return Doctor.create(data, data.id);
  }

  async delete(id: string): Promise<void> {
    await this.query('delete', { where: { id } });
  }

  private toPersistence(entity: Doctor): any {
    return {
      id: entity.id,
      firstName: entity.firstName,
      lastName: entity.lastName,
      specialty: entity.specialty,
      phone: entity.phone,
      email: entity.email,
      commissionRate: entity.commissionRate,
      isActive: entity.isActive,
    };
  }
}
