import { Patient } from '../../domain/entities/Patient';
import { Email } from '../../domain/value-objects/Email';
import { Phone } from '../../domain/value-objects/Phone';
import { IPatientRepository } from '../../domain/interfaces/IPatientRepository';

// This is a renderer-side implementation that communicates with the main process
// via the exposed electronAPI.

export class PatientRepository implements IPatientRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('patient', method, ...args);
    if (!success) {
      throw new Error(error);
    }
    return data;
  }

  async findById(id: string): Promise<Patient | null> {
    const data = await this.query('findUnique', { where: { id } });
    return data ? this.toDomain(data) : null;
  }

  async findByLabId(labId: string): Promise<Patient[]> {
    const data = await this.query('findMany', {
      where: { labId },
      orderBy: { createdAt: 'desc' }
    });
    return data.map(d => this.toDomain(d));
  }

  async create(entity: Patient): Promise<Patient> {
    const data = await this.query('create', {
      data: {
        id: entity.id,
        firstName: entity.firstName,
        lastName: entity.lastName,
        email: entity.email?.value,
        phone: entity.phone.value,
        birthDate: entity.birthDate,
        gender: entity.gender,
        address: entity.address,
        labId: entity.labId
      }
    });
    return this.toDomain(data);
  }

  async update(entity: Patient): Promise<Patient> {
    const data = await this.query('update', {
      where: { id: entity.id },
      data: {
        firstName: entity.firstName,
        lastName: entity.lastName,
        email: entity.email?.value,
        phone: entity.phone.value,
        birthDate: entity.birthDate,
        gender: entity.gender,
        address: entity.address
      }
    });
    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.query('delete', { where: { id } });
  }

  async search(labId: string, query: string): Promise<Patient[]> {
    const data = await this.query('findMany', {
      where: {
        labId,
        OR: [
          { firstName: { contains: query } },
          { lastName: { contains: query } },
          { phone: { contains: query } },
          { email: { contains: query } }
        ]
      }
    });
    return data.map(d => this.toDomain(d));
  }

  private toDomain(data: any): Patient {
    return Patient.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email ? Email.create(data.email) : undefined,
      phone: Phone.create(data.phone),
      birthDate: new Date(data.birthDate),
      gender: data.gender,
      address: data.address,
      labId: data.labId
    }, data.id);
  }
}
