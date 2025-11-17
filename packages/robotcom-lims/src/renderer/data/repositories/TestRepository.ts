import { Test } from '../../domain/entities/Test';
import { ITestRepository } from '../../domain/interfaces/ITestRepository';

export class TestRepository implements ITestRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('test', method, ...args);
    if (!success) throw new Error(error || 'Database query failed');
    return data;
  }

  async findAll(): Promise<Test[]> {
    const data = await this.query('findMany');
    return data.map(this.toDomain);
  }

  async findById(id: string): Promise<Test | null> {
    const data = await this.query('findUnique', { where: { id } });
    return data ? this.toDomain(data) : null;
  }

  async create(entity: Test): Promise<Test> {
    const data = await this.query('create', { data: this.toPersistence(entity) });
    return this.toDomain(data);
  }

  async update(entity: Test): Promise<Test> {
    const data = await this.query('update', { where: { id: entity.id }, data: this.toPersistence(entity) });
    return this.toDomain(data);
  }

  private toDomain(data: any): Test {
    return Test.create(data, data.id);
  }

  private toPersistence(entity: Test): any {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      price: entity.price,
      category: entity.category,
      normalRange: entity.normalRange,
      unit: entity.unit,
      isActive: entity.isActive,
    };
  }
}
