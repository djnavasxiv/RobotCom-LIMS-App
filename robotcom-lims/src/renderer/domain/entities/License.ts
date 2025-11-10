import { Entity } from './Entity';

interface LicenseProps {
  licenseKey: string;
  machineId: string;
  subscriptionType: string;
  isActive: boolean;
  activatedAt: Date;
  expiresAt: Date;
  lastCheckAt: Date;
  gracePeriodEnds?: Date;
}

export class License extends Entity<LicenseProps> {
  private constructor(props: LicenseProps, id?: string) {
    super(props, id);
  }

  public static create(props: LicenseProps, id?: string): License {
    const license = new License(props, id);
    if (!license.validate()) {
      throw new Error('Invalid license data');
    }
    return license;
  }

  public validate(): boolean {
    return this.props.licenseKey?.trim().length > 0 &&
           this.props.machineId?.trim().length > 0;
  }

  get licenseKey(): string { return this.props.licenseKey; }
  get machineId(): string { return this.props.machineId; }
  get subscriptionType(): string { return this.props.subscriptionType; }
  get isActive(): boolean { return this.props.isActive; }
  get activatedAt(): Date { return this.props.activatedAt; }
  get expiresAt(): Date { return this.props.expiresAt; }
  get lastCheckAt(): Date { return this.props.lastCheckAt; }
  get gracePeriodEnds(): Date | undefined { return this.props.gracePeriodEnds; }

  public touch(): void {
    this.props.lastCheckAt = new Date();
    super.touch();
  }
}
