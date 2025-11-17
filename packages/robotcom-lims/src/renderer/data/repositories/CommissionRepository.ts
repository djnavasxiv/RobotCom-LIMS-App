import { Commission } from '../../domain/entities/Commission';
import { ICommissionRepository } from '../../domain/interfaces/ICommissionRepository';

export class CommissionRepository implements ICommissionRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('commission', method, ...args);
    if (!success) throw new Error(error || 'Database query failed');
    return data;
  }

  async findAll(): Promise<Commission[]> {
    const data = await this.query('findMany', { include: { doctor: true, invoice: true } });
    return data.map(d => Commission.create(d, d.id));
  }
}
