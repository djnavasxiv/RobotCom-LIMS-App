import { Sample } from '../../domain/entities/Sample';
import { Test } from '../../domain/entities/Test';
import { ISampleRepository } from '../../domain/interfaces/ISampleRepository';

export class SampleRepository implements ISampleRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('sample', method, ...args);
    if (!success) throw new Error(error);
    return data;
  }

  async findById(id: string): Promise<Sample | null> {
    const data = await this.query('findUnique', { where: { id }, include: { tests: { include: { test: true } } } });
    return data ? this.toDomain(data) : null;
  }

  async create(entity: Sample): Promise<Sample> {
    const data = await this.query('create', {
      data: {
        id: entity.id,
        sampleNumber: entity.sampleNumber,
        patientId: entity.patientId,
        collectionDate: entity.collectionDate,
        status: entity.status,
        notes: entity.notes,
        profileId: entity.profile?.id,
        tests: {
          create: entity.tests.map(test => ({
            test: { connect: { id: test.id } },
            price: test.price
          }))
        }
      },
      include: { tests: { include: { test: true } } }
    });
    return this.toDomain(data);
  }

  private toDomain(data: any): Sample {
    const tests = data.tests.map((item: any) => Test.create(item.test, item.test.id));
    return Sample.create({
      sampleNumber: data.sampleNumber,
      patientId: data.patientId,
      tests: tests,
      collectionDate: new Date(data.collectionDate),
      status: data.status,
      notes: data.notes,
      // profile would be loaded here if needed
    }, data.id);
  }
}
