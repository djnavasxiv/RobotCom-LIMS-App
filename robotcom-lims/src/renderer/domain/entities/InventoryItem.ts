import { Entity } from './Entity';

interface InventoryItemProps {
  code: string;
  name: string;
  description?: string;
  category?: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  unitPrice?: number;
  supplier?: string;
  notes?: string;
  isActive: boolean;
}

export class InventoryItem extends Entity<InventoryItemProps> {
  private constructor(props: InventoryItemProps, id?: string) {
    super(props, id);
  }

  public static create(props: InventoryItemProps, id?: string): InventoryItem {
    const item = new InventoryItem(props, id);
    if (!item.validate()) {
      throw new Error('Invalid inventory item data');
    }
    return item;
  }

  public validate(): boolean {
    return this.props.code?.trim().length > 0 &&
           this.props.name?.trim().length > 0 &&
           this.props.quantity >= 0;
  }

  get code(): string { return this.props.code; }
  get name(): string { return this.props.name; }
  get description(): string | undefined { return this.props.description; }
  get category(): string | undefined { return this.props.category; }
  get quantity(): number { return this.props.quantity; }
  get minQuantity(): number { return this.props.minQuantity; }
  get unit(): string { return this.props.unit; }
  get unitPrice(): number | undefined { return this.props.unitPrice; }
  get supplier(): string | undefined { return this.props.supplier; }
  get notes(): string | undefined { return this.props.notes; }
  get isActive(): boolean { return this.props.isActive; }

  public adjustStock(quantity: number): void {
    if (this.props.quantity + quantity < 0) {
      throw new Error('Stock cannot be negative');
    }
    this.props.quantity += quantity;
    this.touch();
  }

  public isBelowMinimum(): boolean {
    return this.props.quantity < this.props.minQuantity;
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
