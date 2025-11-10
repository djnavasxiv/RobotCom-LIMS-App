import { Invoice } from '../../domain/entities/Invoice';
import { IInvoiceRepository } from '../../domain/interfaces/IInvoiceRepository';

export class InvoiceRepository implements IInvoiceRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('invoice', method, ...args);
    if (!success) throw new Error(error);
    return data;
  }

  async findAll(): Promise<Invoice[]> {
    const data = await this.query('findMany', { orderBy: { createdAt: 'desc' } });
    return data.map(this.toDomain);
  }

  async findById(id: string): Promise<Invoice | null> {
    const data = await this.query('findUnique', { where: { id }, include: { items: true, patient: true } });
    return data ? this.toDomain(data) : null;
  }

  async create(entity: Invoice): Promise<Invoice> {
    const data = await this.query('create', { data: this.toPersistence(entity) });
    return this.toDomain(data);
  }

  async update(entity: Invoice): Promise<Invoice> {
    const data = await this.query('update', { where: { id: entity.id }, data: this.toPersistence(entity) });
    return this.toDomain(data);
  }

  private toDomain(data: any): Invoice {
    // This is a simplified mapping. A real implementation would also map items, patient, etc.
    return Invoice.create({
      ...data,
    }, data.id);
  }

  private toPersistence(entity: Invoice): any {
    return {
      id: entity.id,
      invoiceNumber: entity.invoiceNumber,
      patientId: entity.patientId,
      labId: entity.labId,
      subtotal: entity.subtotal,
      tax: entity.tax,
      discount: entity.discount,
      total: entity.total,
      status: entity.status,
      dueDate: entity.dueDate,
      paidDate: entity.paidDate,
      notes: entity.notes,
      // Items would be handled here in a real implementation
    };
  }
}
