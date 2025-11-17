import { Result } from '../../domain/entities/Result';
import { Sample } from '../../domain/entities/Sample';
import { IResultRepository } from '../../domain/interfaces/IResultRepository';
import { ISampleRepository } from '../../domain/interfaces/ISampleRepository'; // This needs to be created
import { ResultRepository } from '../../data/repositories/ResultRepository';
import { SampleRepository } from '../../data/repositories/SampleRepository'; // Sample repo needs findById

export class ResultService {
  private resultRepository: IResultRepository;
  private sampleRepository: ISampleRepository;

  constructor() {
    this.resultRepository = new ResultRepository();
    this.sampleRepository = new SampleRepository(); // And findById added
  }

  // This is a placeholder for a proper sample search/list UI
  async findSampleById(sampleId: string): Promise<Sample | null> {
    return this.sampleRepository.findById(sampleId);
  }

  async getResultsForSample(sampleId: string): Promise<Result[]> {
    return this.resultRepository.findBySampleId(sampleId);
  }

  async saveResults(
    sampleId: string,
    results: Array<{ testId: string; value: string; notes?: string }>
  ): Promise<void> {
    const resultEntities = results.map(r => Result.create({
      sampleId,
      testId: r.testId,
      value: r.value,
      notes: r.notes,
      isNormal: true, // Normality check would be implemented here
      enteredAt: new Date(),
      // enteredBy would come from auth context
    }));

    await this.resultRepository.createMany(resultEntities);

    // You would also update the sample status here, e.g., to 'complete'
  }
}
