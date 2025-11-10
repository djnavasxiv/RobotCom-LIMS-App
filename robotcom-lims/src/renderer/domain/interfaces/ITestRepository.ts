import { Test } from '../entities/Test';

export interface ITestRepository {
  findAll(): Promise<Test[]>;
  findById(id: string): Promise<Test | null>;
  create(entity: Test): Promise<Test>;
  update(entity: Test): Promise<Test>;
}
