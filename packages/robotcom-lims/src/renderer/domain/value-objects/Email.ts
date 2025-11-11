export class Email {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(email: string): Email {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    return new Email(email.toLowerCase().trim());
  }

  get value(): string { return this._value; }

  public isValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._value);
  }
}
