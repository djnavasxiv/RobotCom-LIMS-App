import { Entity } from './Entity';
import { Email } from '../value-objects/Email';
import { Phone } from '../value-objects/Phone';

interface PatientProps {
  firstName: string;
  lastName: string;
  email?: Email;
  phone: Phone;
  birthDate: Date;
  gender: 'male' | 'female' | 'other';
  address?: string;
  labId: string;
}

export class Patient extends Entity<PatientProps> {
  private constructor(props: PatientProps, id?: string) {
    super(props, id);
  }

  public static create(props: PatientProps, id?: string): Patient {
    const patient = new Patient(props, id);
    if (!patient.validate()) {
      throw new Error('Invalid patient data');
    }
    return patient;
  }

  public validate(): boolean {
    return this.props.firstName?.trim().length > 0 &&
           this.props.lastName?.trim().length > 0 &&
           this.props.phone?.value.length > 0;
  }

  get firstName(): string { return this.props.firstName; }
  get lastName(): string { return this.props.lastName; }
  get fullName(): string { return `${this.props.firstName} ${this.props.lastName}`; }
  get email(): Email | undefined { return this.props.email; }
  get phone(): Phone { return this.props.phone; }
  get birthDate(): Date { return this.props.birthDate; }
  get gender(): string { return this.props.gender; }
  get address(): string | undefined { return this.props.address; }
  get labId(): string { return this.props.labId; }

  public getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.props.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  public updateContactInfo(email: Email | undefined, phone: Phone): void {
    this.props.email = email;
    this.props.phone = phone;
    this.touch();
  }

  public updateAddress(address: string): void {
    this.props.address = address;
    this.touch();
  }
}
