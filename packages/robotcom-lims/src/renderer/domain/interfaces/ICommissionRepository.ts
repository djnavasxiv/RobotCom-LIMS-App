import { Commission } from '../entities/Commission';

export interface ICommissionRepository {
  findAll(): Promise<Commission[]>;
}
