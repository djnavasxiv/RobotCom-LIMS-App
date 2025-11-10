import { Entity } from './Entity';

interface CommissionProps {
  doctorId: string;
  invoiceId: string;
  amount: number;
  percentage: number;
  isPaid: boolean;
  paidDate?: Date;
  notes?: string;
}

export class Commission extends Entity<CommissionProps> {
  private constructor(props: CommissionProps, id?: string) {
    super(props, id);
  }

  public static create(props: CommissionProps, id?: string): Commission {
    const commission = new Commission(props, id);
    if (!commission.validate()) {
      throw new Error('Invalid commission data');
    }
    return commission;
  }

  public validate(): boolean {
    return this.props.doctorId?.trim().length > 0 &&
           this.props.invoiceId?.trim().length > 0 &&
           this.props.amount > 0 &&
           this.props.percentage > 0;
  }

  get doctorId(): string { return this.props.doctorId; }
  get invoiceId(): string { return this.props.invoiceId; }
  get amount(): number { return this.props.amount; }
  get percentage(): number { return this.props.percentage; }
  get isPaid(): boolean { return this.props.isPaid; }
  get paidDate(): Date | undefined { return this.props.paidDate; }
  get notes(): string | undefined { return this.props.notes; }

  public markAsPaid(): void {
    this.props.isPaid = true;
    this.props.paidDate = new Date();
    this.touch();
  }
}
