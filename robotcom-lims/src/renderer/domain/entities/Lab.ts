import { Entity } from './Entity';

interface LabProps {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo?: string;
  customText1?: string;
  customText2?: string;
}

export class Lab extends Entity<LabProps> {
  private constructor(props: LabProps, id?: string) {
    super(props, id);
  }

  public static create(props: LabProps, id?: string): Lab {
    const lab = new Lab(props, id);
    if (!lab.validate()) {
      throw new Error('Invalid lab data');
    }
    return lab;
  }

  public validate(): boolean {
    return this.props.name?.trim().length > 0;
  }

  get name(): string { return this.props.name; }
  get address(): string | undefined { return this.props.address; }
  get phone(): string | undefined { return this.props.phone; }
  get email(): string | undefined { return this.props.email; }
  get logo(): string | undefined { return this.props.logo; }
  get customText1(): string | undefined { return this.props.customText1; }
  get customText2(): string | undefined { return this.props.customText2; }

  public updateBranding(logo: string, customText1: string, customText2: string): void {
    this.props.logo = logo;
    this.props.customText1 = customText1;
    this.props.customText2 = customText2;
    this.touch();
  }
}
