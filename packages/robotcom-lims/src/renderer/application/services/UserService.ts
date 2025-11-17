import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserRepository } from '../../data/repositories/UserRepository';

export class UserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(username: string, password: string): Promise<User | null> {
    try {
      // Call the main process to validate credentials (which has bcrypt access)
      const result = await window.electronAPI.dbQuery('user', 'validatePassword', username, password);
      if (!result.success) {
        return null;
      }
      
      if (result.data.isValid) {
        // Fetch the user data
        const user = await this.userRepository.findByUsername(username);
        return user;
      }
      return null;
    } catch (err) {
      console.error('Login error:', err);
      return null;
    }
  }

  async createUser(data: any): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = User.create({
      username: data.username,
      passwordHash,
      fullName: data.fullName,
      email: data.email,
      role: data.role,
      isActive: true,
      labId: data.labId,
    });

    return this.userRepository.create(user);
  }
}
