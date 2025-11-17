import { Result } from '../../domain/entities/Result';
import { IResultRepository } from '../../domain/interfaces/IResultRepository';

export class ResultRepository implements IResultRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('result', method, ...args);
    if (!success) throw new Error(error || 'Database query failed');
    return data;
  }

  async createMany(results: Result[]): Promise<void> {
    const data = results.map(r => this.toPersistence(r));
    await this.query('createMany', { data });
  }

  async findBySampleId(sampleId: string): Promise<Result[]> {
    const data = await this.query('findMany', { where: { sampleId } });
    return data.map(this.toDomain);
  }

  private toDomain(data: any): Result {
    return Result.create(data, data.id);
  }

  private toPersistence(entity: Result): any {
    return {
      id: entity.id,
      sampleId: entity.sampleId,
      testId: entity.testId,
      value: entity.value,
      isNormal: entity.isNormal,
      notes: entity.notes,
      enteredBy: entity.enteredBy,
      enteredAt: entity.enteredAt,
    };
  }
}
