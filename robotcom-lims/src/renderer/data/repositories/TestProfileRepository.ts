import { TestProfile } from '../../domain/entities/TestProfile';
import { Test } from '../../domain/entities/Test';
import { ITestProfileRepository } from '../../domain/interfaces/ITestProfileRepository';

export class TestProfileRepository implements ITestProfileRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('testProfile', method, ...args);
    if (!success) throw new Error(error);
    return data;
  }

  async findAll(): Promise<TestProfile[]> {
    const data = await this.query('findMany', { include: { tests: { include: { test: true } } } });
    return data.map(this.toDomain);
  }

  async findById(id: string): Promise<TestProfile | null> {
    const data = await this.query('findUnique', { where: { id }, include: { tests: { include: { test: true } } } });
    return data ? this.toDomain(data) : null;
  }

  async create(entity: TestProfile): Promise<TestProfile> {
    const data = await this.query('create', {
      data: {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        isActive: entity.isActive,
        tests: {
          create: entity.tests.map(test => ({ test: { connect: { id: test.id } } }))
        }
      }
    });
    return this.toDomain(data);
  }

  async update(entity: TestProfile): Promise<TestProfile> {
    const data = await this.query('update', {
      where: { id: entity.id },
      data: {
        name: entity.name,
        description: entity.description,
        isActive: entity.isActive,
        tests: {
          deleteMany: {},
          create: entity.tests.map(test => ({ test: { connect: { id: test.id } } }))
        }
      },
      include: { tests: { include: { test: true } } }
    });
    return this.toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await this.query('delete', { where: { id } });
  }

  private toDomain(data: any): TestProfile {
    const tests = data.tests.map((item: any) => Test.create(item.test, item.test.id));
    return TestProfile.create({
      name: data.name,
      description: data.description,
      isActive: data.isActive,
      tests: tests,
    }, data.id);
  }
}
