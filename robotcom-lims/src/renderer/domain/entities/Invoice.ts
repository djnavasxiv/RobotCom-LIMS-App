import { Entity } from './Entity';

interface InvoiceProps {
  invoiceNumber: string;
  patientId: string;
  labId: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate?: Date;
  paidDate?: Date;
  notes?: string;
}

export class Invoice extends Entity<InvoiceProps> {
  private constructor(props: InvoiceProps, id?: string) {
    super(props, id);
  }

  public static create(props: InvoiceProps, id?: string): Invoice {
    const invoice = new Invoice(props, id);
    if (!invoice.validate()) {
      throw new Error('Invalid invoice data');
    }
    return invoice;
  }

  public validate(): boolean {
    return this.props.invoiceNumber?.trim().length > 0 &&
           this.props.patientId?.trim().length > 0 &&
           this.props.labId?.trim().length > 0 &&
           this.props.subtotal >= 0 &&
           this.props.total >= 0;
  }

  get invoiceNumber(): string { return this.props.invoiceNumber; }
  get patientId(): string { return this.props.patientId; }
  get labId(): string { return this.props.labId; }
  get subtotal(): number { return this.props.subtotal; }
  get tax(): number { return this.props.tax; }
  get discount(): number { return this.props.discount; }
  get total(): number { return this.props.total; }
  get status(): string { return this.props.status; }
  get dueDate(): Date | undefined { return this.props.dueDate; }
  get paidDate(): Date | undefined { return this.props.paidDate; }
  get notes(): string | undefined { return this.props.notes; }

  public calculateTotal(): void {
    this.props.total = this.props.subtotal + this.props.tax - this.props.discount;
    this.touch();
  }

  public applyDiscount(discount: number): void {
    if (discount < 0 || discount > this.props.subtotal) {
      throw new Error('Invalid discount amount');
    }
    this.props.discount = discount;
    this.calculateTotal();
  }

  public markAsPaid(): void {
    this.props.status = 'paid';
    this.props.paidDate = new Date();
    this.touch();
  }

  public cancel(): void {
    if (this.props.status === 'paid') {
      throw new Error('Cannot cancel a paid invoice');
    }
    this.props.status = 'cancelled';
    this.touch();
  }

  public isOverdue(): boolean {
    if (!this.props.dueDate || this.props.status === 'paid') {
      return false;
    }
    return new Date() > this.props.dueDate;
  }
}
