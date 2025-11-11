import { Entity } from './Entity';

interface DoctorProps {
  firstName: string;
  lastName: string;
  specialty?: string;
  phone?: string;
  email?: string;
  commissionRate: number;
  isActive: boolean;
}

export class Doctor extends Entity<DoctorProps> {
  private constructor(props: DoctorProps, id?: string) {
    super(props, id);
  }

  public static create(props: DoctorProps, id?: string): Doctor {
    const doctor = new Doctor(props, id);
    if (!doctor.validate()) {
      throw new Error('Invalid doctor data');
    }
    return doctor;
  }

  public validate(): boolean {
    return this.props.firstName?.trim().length > 0 &&
           this.props.lastName?.trim().length > 0 &&
           this.props.commissionRate >= 0;
  }

  get firstName(): string { return this.props.firstName; }
  get lastName(): string { return this.props.lastName; }
  get fullName(): string { return `${this.props.firstName} ${this.props.lastName}`; }
  get specialty(): string | undefined { return this.props.specialty; }
  get phone(): string | undefined { return this.props.phone; }
  get email(): string | undefined { return this.props.email; }
  get commissionRate(): number { return this.props.commissionRate; }
  get isActive(): boolean { return this.props.isActive; }

  public updateCommissionRate(newRate: number): void {
    if (newRate < 0) {
      throw new Error('Commission rate cannot be negative');
    }
    this.props.commissionRate = newRate;
    this.touch();
  }

  public deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  public activate(): void {
    this.props.isActive = true;
    this.touch();
  }
}
