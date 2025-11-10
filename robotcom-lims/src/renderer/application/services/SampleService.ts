import { Sample } from '../../domain/entities/Sample';
import { Patient } from '../../domain/entities/Patient';
import { Test } from '../../domain/entities/Test';
import { TestProfile } from '../../domain/entities/TestProfile';
import { ISampleRepository } from '../../domain/interfaces/ISampleRepository';
import { IPatientRepository } from '../../domain/interfaces/IPatientRepository';
import { ITestRepository } from '../../domain/interfaces/ITestRepository';
import { ITestProfileRepository } from '../../domain/interfaces/ITestProfileRepository';
import { SampleRepository } from '../../data/repositories/SampleRepository';
import { PatientRepository } from '../../data/repositories/PatientRepository';
import { TestRepository } from '../../data/repositories/TestRepository';
import { TestProfileRepository } from '../../data/repositories/TestProfileRepository';
import { InvoiceService } from './InvoiceService';

export class SampleService {
  private sampleRepository: ISampleRepository;
  private invoiceService: InvoiceService;
  private patientRepository: IPatientRepository;
  private testRepository: ITestRepository;
  private testProfileRepository: ITestProfileRepository;

  constructor() {
    this.sampleRepository = new SampleRepository();
    this.patientRepository = new PatientRepository();
    this.testRepository = new TestRepository();
    this.testProfileRepository = new TestProfileRepository();
    this.invoiceService = new InvoiceService();
  }

  async getAllPatients(labId: string): Promise<Patient[]> {
    return this.patientRepository.findByLabId(labId);
  }

  async searchPatients(labId: string, query: string): Promise<Patient[]> {
    return this.patientRepository.search(labId, query);
  }

  async getAllTests(): Promise<Test[]> {
    return this.testRepository.findAll();
  }

  async getAllTestProfiles(): Promise<TestProfile[]> {
    return this.testProfileRepository.findAll();
  }

  async createSample(data: {
    patientId: string;
    profileId?: string;
    testIds: string[];
    sampleNumber: string;
    notes?: string;
    labId: string;
  }): Promise<Sample> {
    const tests: Test[] = [];
    let profile: TestProfile | undefined = undefined;

    if (data.profileId) {
      const p = await this.testProfileRepository.findById(data.profileId);
      if (!p) throw new Error('Test profile not found');
      profile = p;
      tests.push(...p.tests);
    } else {
      const allTests = await this.getAllTests();
      tests.push(...allTests.filter(t => data.testIds.includes(t.id)));
    }

    if (tests.length === 0) {
      throw new Error('At least one test must be selected');
    }

    const sample = Sample.create({
      patientId: data.patientId,
      sampleNumber: data.sampleNumber,
      tests,
      profile,
      collectionDate: new Date(),
      status: 'pending',
      notes: data.notes,
    });

    const createdSample = await this.sampleRepository.create(sample);

    // Automatically generate an invoice for the new sample
    await this.invoiceService.generateInvoiceForSample(createdSample, data.labId);

    return createdSample;
  }
}
