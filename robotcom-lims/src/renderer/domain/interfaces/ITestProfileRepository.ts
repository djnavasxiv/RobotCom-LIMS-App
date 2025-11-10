import { TestProfile } from '../entities/TestProfile';

export interface ITestProfileRepository {
  findAll(): Promise<TestProfile[]>;
  findById(id: string): Promise<TestProfile | null>;
  create(entity: TestProfile): Promise<TestProfile>;
  update(entity: TestProfile): Promise<TestProfile>;
  delete(id: string): Promise<void>;
}
