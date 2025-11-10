import { Lab } from '../entities/Lab';

export interface ILabRepository {
  find(): Promise<Lab | null>;
  update(entity: Lab): Promise<Lab>;
}
