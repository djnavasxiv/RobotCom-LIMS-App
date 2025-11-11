import { Invoice } from '../entities/Invoice';

export interface IInvoiceRepository {
  findAll(): Promise<Invoice[]>;
  findById(id: string): Promise<Invoice | null>;
  create(entity: Invoice): Promise<Invoice>;
  update(entity: Invoice): Promise<Invoice>;
}
