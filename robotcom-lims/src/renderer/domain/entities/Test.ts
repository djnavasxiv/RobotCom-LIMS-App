import { Entity } from './Entity';

interface TestProps {
  code: string;
  name: string;
  price: number;
  category?: string;
  normalRange?: string;
  unit?: string;
  isActive: boolean;
}

export class Test extends Entity<TestProps> {
  private constructor(props: TestProps, id?: string) {
    super(props, id);
  }

  public static create(props: TestProps, id?: string): Test {
    const test = new Test(props, id);
    if (!test.validate()) {
      throw new Error('Invalid test data');
    }
    return test;
  }

  public validate(): boolean {
    return this.props.code?.trim().length > 0 &&
           this.props.name?.trim().length > 0 &&
           this.props.price > 0;
  }

  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get price(): number { return this.props.price; }
  get category(): string | undefined { return this.props.category; }
  get normalRange(): string | undefined { return this.props.normalRange; }
  get unit(): string | undefined { return this.props.unit; }
  get isActive(): boolean { return this.props.isActive; }

  public updatePrice(newPrice: number): void {
    if (newPrice <= 0) {
      throw new Error('Price must be greater than 0');
    }
    this.props.price = newPrice;
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
