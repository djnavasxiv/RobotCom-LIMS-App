import { Invoice } from '../../domain/entities/Invoice';
import { InvoiceItem } from '../../domain/entities/InvoiceItem';
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
    const invoiceNumber = `INV-${Date.now()}`;

    const items = sample.tests.map(test => InvoiceItem.create({
      invoiceId: '', // The ID will be set by the database relation
      description: test.name,
      quantity: 1,
      unitPrice: test.price,
      total: test.price,
    }));

    const invoice = Invoice.create({
      invoiceNumber,
      patientId: sample.patientId,
      labId,
      subtotal,
      tax: 0,
      discount: 0,
      total: subtotal,
      status: 'pending',
      items,
    });

    // The repository now handles the nested creation
    return this.invoiceRepository.create(invoice);
  }
}
