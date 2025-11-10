import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { UserRepository } from '../../data/repositories/UserRepository';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class UserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(username: string, password: string):Promise<User | null> {
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      return null;
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return null;
    }

    return user;
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
