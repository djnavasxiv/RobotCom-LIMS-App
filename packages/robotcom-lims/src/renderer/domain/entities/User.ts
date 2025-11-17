import { Entity } from './Entity';

interface UserProps {
  username: string;
  passwordHash: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  labId: string;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(props: UserProps, id?: string): User {
    const user = new User(props, id);
    if (!user.validate()) {
      throw new Error('Invalid user data');
    }
    return user;
  }

  public validate(): boolean {
    return this.props.username?.trim().length > 0 &&
           this.props.passwordHash?.trim().length > 0;
  }

  get username(): string { return this.props.username; }
  get passwordHash(): string { return this.props.passwordHash; }
  get fullName(): string { return this.props.fullName; }
  get email(): string { return this.props.email; }
  get role(): string { return this.props.role; }
  get isActive(): boolean { return this.props.isActive; }
  get labId(): string { return this.props.labId; }
}
