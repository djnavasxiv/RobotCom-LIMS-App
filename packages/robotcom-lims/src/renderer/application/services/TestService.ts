import { ITestRepository } from '../../domain/interfaces/ITestRepository';
import { Test } from '../../domain/entities/Test';
import { TestRepository } from '../../data/repositories/TestRepository';

export class TestService {
  private testRepository: ITestRepository;

  constructor() {
    this.testRepository = new TestRepository();
  }

  /**
   * Get all active tests
   */
  async getAllTests(): Promise<Test[]> {
    return await this.testRepository.findAll();
  }

  /**
   * Get test by ID
   */
  async getTestById(id: string): Promise<Test | null> {
    return await this.testRepository.findById(id);
  }

  /**
   * Create a new test
   */
  async createTest(data: {
    code: string;
    name: string;
    price: number;
    category?: string;
    normalRange?: string;
    unit?: string;
    isActive?: boolean;
  }): Promise<Test> {
    const test = Test.create({
      code: data.code,
      name: data.name,
      price: data.price,
      category: data.category,
      normalRange: data.normalRange,
      unit: data.unit,
      isActive: data.isActive ?? true,
    });

    return await this.testRepository.create(test);
  }

  /**
   * Update test
   */
  async updateTest(
    id: string,
    data: Partial<{
      name: string;
      price: number;
      category: string;
      normalRange: string;
      unit: string;
      isActive: boolean;
    }>
  ): Promise<Test | null> {
    const test = await this.testRepository.findById(id);
    if (!test) return null;

    // Update properties
    if (data.name) Object.assign(test['props'], { name: data.name });
    if (data.price !== undefined) test.updatePrice(data.price);
    if (data.category !== undefined) Object.assign(test['props'], { category: data.category });
    if (data.normalRange !== undefined) Object.assign(test['props'], { normalRange: data.normalRange });
    if (data.unit !== undefined) Object.assign(test['props'], { unit: data.unit });
    if (data.isActive === false) test.deactivate();

    return await this.testRepository.update(test);
  }

  /**
   * Delete test (soft delete by setting isActive to false)
   */
  async deleteTest(id: string): Promise<void> {
    const test = await this.testRepository.findById(id);
    if (test) {
      test.deactivate();
      await this.testRepository.update(test);
    }
  }

  /**
   * Calculate total price for selected tests
   */
  calculateTestsTotal(tests: Test[]): number {
    return tests.reduce((total, test) => total + test.price, 0);
  }

  /**
   * Calculate discounted total
   */
  calculateDiscountedTotal(total: number, discountPercentage: number): number {
    return total - (total * discountPercentage / 100);
  }
}
