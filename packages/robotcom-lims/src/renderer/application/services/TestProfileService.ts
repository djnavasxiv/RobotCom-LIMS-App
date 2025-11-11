import { TestProfile } from '../../domain/entities/TestProfile';
import { Test } from '../../domain/entities/Test';
import { ITestProfileRepository } from '../../domain/interfaces/ITestProfileRepository';
import { ITestRepository } from '../../domain/interfaces/ITestRepository';
import { TestProfileRepository } from '../../data/repositories/TestProfileRepository';
import { TestRepository } from '../../data/repositories/TestRepository';

export class TestProfileService {
  private testProfileRepository: ITestProfileRepository;
  private testRepository: ITestRepository;

  constructor() {
    this.testProfileRepository = new TestProfileRepository();
    this.testRepository = new TestRepository();
  }

  async getAllTestProfiles(): Promise<TestProfile[]> {
    return this.testProfileRepository.findAll();
  }

  async getAllTests(): Promise<Test[]> {
    return this.testRepository.findAll();
  }

  async createTestProfile(name: string, description: string, testIds: string[]): Promise<TestProfile> {
    const allTests = await this.getAllTests();
    const selectedTests = allTests.filter(t => testIds.includes(t.id));

    const profile = TestProfile.create({
      name,
      description,
      tests: selectedTests,
      isActive: true,
    });

    return this.testProfileRepository.create(profile);
  }

  async updateTestProfile(id: string, name: string, description: string, testIds: string[]): Promise<TestProfile> {
    const profile = await this.testProfileRepository.findById(id);
    if (!profile) {
      throw new Error('Test profile not found');
    }

    const allTests = await this.getAllTests();
    const selectedTests = allTests.filter(t => testIds.includes(t.id));

    // This is a simplified update. A real implementation might update properties individually.
    const updatedProfile = TestProfile.create({
      name,
      description,
      tests: selectedTests,
      isActive: profile.isActive,
    }, id);

    return this.testProfileRepository.update(updatedProfile);
  }

  async deleteTestProfile(id: string): Promise<void> {
    return this.testProfileRepository.delete(id);
  }
}
