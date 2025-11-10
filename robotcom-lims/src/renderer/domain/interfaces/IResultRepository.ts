import { Result } from '../entities/Result';

export interface IResultRepository {
  createMany(results: Result[]): Promise<void>;
  findBySampleId(sampleId: string): Promise<Result[]>;
}
