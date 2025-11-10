import { User } from '../entities/User';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | null>;
  create(entity: User): Promise<User>;
}
