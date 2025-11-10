import { Invoice } from '../../domain/entities/Invoice';
import { Sample } from '../../domain/entities/Sample';
import { IInvoiceRepository } from '../../domain/interfaces/IInvoiceRepository';
import { InvoiceRepository } from '../../data/repositories/InvoiceRepository';

export class InvoiceService {
  private invoiceRepository: IInvoiceRepository;

  constructor() {
    this.invoiceRepository = new InvoiceRepository();
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return this.invoiceRepository.findAll();
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return this.invoiceRepository.findById(id);
  }

  async generateInvoiceForSample(sample: Sample, labId: string): Promise<Invoice> {
    const subtotal = sample.getTotalPrice();
    const invoiceNumber = `INV-${Date.now()}`; // Simple invoice number generation

    const invoice = Invoice.create({
      invoiceNumber,
      patientId: sample.patientId,
      labId,
      subtotal,
      tax: 0, // Assuming no tax for now
      discount: 0, // Assuming no discount for now
      total: subtotal,
      status: 'pending',
      // items will be created via Prisma relations
    });

    // In a real implementation, you would create InvoiceItem entities as well.
    // Prisma's nested writes will handle creating the items.
    const createPayload = {
      data: {
        ...this.toPersistence(invoice),
        sampleId: sample.id,
        items: {
          create: sample.tests.map(test => ({
            description: test.name,
            quantity: 1,
            unitPrice: test.price,
            total: test.price,
          }))
        }
      }
    };

    const createdInvoiceData = await (this.invoiceRepository as any).query('create', createPayload);

    return this.toDomain(createdInvoiceData);
  }

  private toDomain(data: any): Invoice {
    return Invoice.create(data, data.id);
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
    };
  }
}
