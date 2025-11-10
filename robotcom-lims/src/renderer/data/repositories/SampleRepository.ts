import { Sample } from '../../domain/entities/Sample';
import { ISampleRepository } from '../../domain/interfaces/ISampleRepository';

export class SampleRepository implements ISampleRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('sample', method, ...args);
    if (!success) throw new Error(error);
    return data;
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
            price: test.price // Storing the price at the time of order
          }))
        }
      }
    });
    // The created data won't have the full domain objects, so we'll just return the original entity.
    // A more robust implementation would re-fetch the created sample.
    return entity;
  }
}
