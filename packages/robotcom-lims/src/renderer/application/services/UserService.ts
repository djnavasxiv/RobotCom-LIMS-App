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
      // Development mode: allow hardcoded credentials for testing
      // In production with Electron, this would use proper IPC authentication
      if (username === 'admin' && password === 'password') {
        // Return a mock user for development
        return User.create({
          username: 'admin',
          passwordHash: 'hashed',
          fullName: 'Admin User',
          email: 'admin@robotcomlab.com',
          role: 'admin',
          isActive: true,
          labId: '4e48678b-32e4-4fa9-9f85-da0b655a8e69'
        }, 'a236c3ac-7a68-4c92-8038-545feeda7c1c');
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
