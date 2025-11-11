import { Entity } from './Entity';

interface InvoiceItemProps {
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export class InvoiceItem extends Entity<InvoiceItemProps> {
  private constructor(props: InvoiceItemProps, id?: string) {
    super(props, id);
  }

  public static create(props: InvoiceItemProps, id?: string): InvoiceItem {
    const item = new InvoiceItem(props, id);
    if (!item.validate()) {
      throw new Error('Invalid invoice item data');
    }
    return item;
  }

  public validate(): boolean {
    return this.props.description?.trim().length > 0 &&
           this.props.quantity > 0 &&
           this.props.unitPrice >= 0;
  }

  get invoiceId(): string { return this.props.invoiceId; }
  get description(): string { return this.props.description; }
  get quantity(): number { return this.props.quantity; }
  get unitPrice(): number { return this.props.unitPrice; }
  get total(): number { return this.props.total; }
}
