import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';

export class UserRepository implements IUserRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('user', method, ...args);
    if (!success) throw new Error(error || 'Database query failed');
    return data;
  }

  async findByUsername(username: string): Promise<User | null> {
    const data = await this.query('findUnique', { where: { username } });
    return data ? User.create({ ...data, passwordHash: data.password }, data.id) : null;
  }

  async create(entity: User): Promise<User> {
    const data = await this.query('create', { data: {
      id: entity.id,
      username: entity.username,
      password: entity.passwordHash,
      fullName: entity.fullName,
      email: entity.email,
      role: entity.role,
      isActive: entity.isActive,
      labId: entity.labId,
    }});
    return User.create({ ...data, passwordHash: data.password }, data.id);
  }
}
