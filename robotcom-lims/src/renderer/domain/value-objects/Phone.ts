export class Phone {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  public static create(phone: string): Phone {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) {
      throw new Error('Invalid phone number');
    }
    return new Phone(cleaned);
  }

  get value(): string { return this._value; }

  public formatted(): string {
    if (this._value.length === 10) {
      return `(${this._value.slice(0, 3)}) ${this._value.slice(3, 6)}-${this._value.slice(6)}`;
    }
    return this._value;
  }
}
