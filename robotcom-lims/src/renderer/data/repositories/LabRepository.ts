import { Lab } from '../../domain/entities/Lab';
import { ILabRepository } from '../../domain/interfaces/ILabRepository';

export class LabRepository implements ILabRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('lab', method, ...args);
    if (!success) throw new Error(error);
    return data;
  }

  async find(): Promise<Lab | null> {
    const data = await this.query('findFirst');
    return data ? Lab.create(data, data.id) : null;
  }

  async update(entity: Lab): Promise<Lab> {
    // In a real app, you'd handle creating one if it doesn't exist
    const data = await this.query('update', { where: { id: entity.id }, data: {
      name: entity.name,
      address: entity.address,
      phone: entity.phone,
      email: entity.email,
      logo: entity.logo,
      customText1: entity.customText1,
      customText2: entity.customText2,
    }});
    return Lab.create(data, data.id);
  }
}
