import { Sample } from '../entities/Sample';

export interface ISampleRepository {
  create(entity: Sample): Promise<Sample>;
}
