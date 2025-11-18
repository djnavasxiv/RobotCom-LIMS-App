/**
 * SeedService - Database seeding and initialization
 * Provides utilities for populating database with initial data
 */

import { PrismaClient } from '@prisma/client';
import LoggerService from './LoggerService';

export interface SeedDataConfig {
  labs?: Array<{ name: string; address?: string; email?: string; phone?: string }>;
  users?: Array<{
    username: string;
    password: string;
    fullName: string;
    email: string;
    role: string;
    labId: string;
  }>;
  tests?: Array<{
    code: string;
    name: string;
    price: number;
    category?: string;
    unit?: string;
  }>;
  testProfiles?: Array<{
    name: string;
    description?: string;
    testIds?: string[];
  }>;
}

export class SeedService {
  private logger = LoggerService;
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  /**
   * Seed database with initial data
   */
  async seedDatabase(config: SeedDataConfig): Promise<void> {
    try {
      this.logger.info('Starting database seeding', 'SeedService');

      // Check if database is already seeded
      const existingLabs = await (this.prisma as any).lab.count();
      if (existingLabs > 0) {
        this.logger.info('Database already seeded, skipping', 'SeedService');
        return;
      }

      // Seed labs
      if (config.labs && config.labs.length > 0) {
        await this.seedLabs(config.labs);
      }

      // Seed tests
      if (config.tests && config.tests.length > 0) {
        await this.seedTests(config.tests);
      }

      // Seed test profiles
      if (config.testProfiles && config.testProfiles.length > 0) {
        await this.seedTestProfiles(config.testProfiles);
      }

      // Seed users (requires lab to exist)
      if (config.users && config.users.length > 0) {
        await this.seedUsers(config.users);
      }

      this.logger.info('Database seeding completed successfully', 'SeedService');
    } catch (error) {
      this.logger.error('Database seeding failed', error, 'SeedService');
      throw error;
    }
  }

  /**
   * Seed labs
   */
  private async seedLabs(
    labs: Array<{ name: string; address?: string; email?: string; phone?: string }>
  ): Promise<void> {
    try {
      this.logger.info(`Seeding ${labs.length} labs`, 'SeedService');

      for (const lab of labs) {
        await (this.prisma as any).lab.create({
          data: lab,
        });
      }

      this.logger.info(`Seeded ${labs.length} labs successfully`, 'SeedService');
    } catch (error) {
      this.logger.error('Failed to seed labs', error, 'SeedService');
      throw error;
    }
  }

  /**
   * Seed tests
   */
  private async seedTests(
    tests: Array<{
      code: string;
      name: string;
      price: number;
      category?: string;
      unit?: string;
    }>
  ): Promise<void> {
    try {
      this.logger.info(`Seeding ${tests.length} tests`, 'SeedService');

      for (const test of tests) {
        await (this.prisma as any).test.create({
          data: test,
        });
      }

      this.logger.info(`Seeded ${tests.length} tests successfully`, 'SeedService');
    } catch (error) {
      this.logger.error('Failed to seed tests', error, 'SeedService');
      throw error;
    }
  }

  /**
   * Seed test profiles
   */
  private async seedTestProfiles(
    profiles: Array<{ name: string; description?: string; testIds?: string[] }>
  ): Promise<void> {
    try {
      this.logger.info(`Seeding ${profiles.length} test profiles`, 'SeedService');

      for (const profile of profiles) {
        const createdProfile = await (this.prisma as any).testProfile.create({
          data: {
            name: profile.name,
            description: profile.description,
          },
        });

        // Associate tests with profile
        if (profile.testIds && profile.testIds.length > 0) {
          for (const testId of profile.testIds) {
            await (this.prisma as any).testProfileItem.create({
              data: {
                profileId: createdProfile.id,
                testId: testId,
              },
            });
          }
        }
      }

      this.logger.info(`Seeded ${profiles.length} test profiles successfully`, 'SeedService');
    } catch (error) {
      this.logger.error('Failed to seed test profiles', error, 'SeedService');
      throw error;
    }
  }

  /**
   * Seed users
   */
  private async seedUsers(
    users: Array<{
      username: string;
      password: string;
      fullName: string;
      email: string;
      role: string;
      labId: string;
    }>
  ): Promise<void> {
    try {
      this.logger.info(`Seeding ${users.length} users`, 'SeedService');

      for (const user of users) {
        // In a real application, you would hash the password here
        await (this.prisma as any).user.create({
          data: user,
        });
      }

      this.logger.info(`Seeded ${users.length} users successfully`, 'SeedService');
    } catch (error) {
      this.logger.error('Failed to seed users', error, 'SeedService');
      throw error;
    }
  }

  /**
   * Clear all data from database
   */
  async clearDatabase(): Promise<void> {
    try {
      this.logger.warn('Clearing all database data', 'SeedService');

      // Delete in correct order (respecting foreign keys)
      await (this.prisma as any).auditLog.deleteMany({});
      await (this.prisma as any).result.deleteMany({});
      await (this.prisma as any).sampleTest.deleteMany({});
      await (this.prisma as any).sample.deleteMany({});
      await (this.prisma as any).invoice.deleteMany({});
      await (this.prisma as any).testProfileItem.deleteMany({});
      await (this.prisma as any).testProfile.deleteMany({});
      await (this.prisma as any).test.deleteMany({});
      await (this.prisma as any).patient.deleteMany({});
      await (this.prisma as any).user.deleteMany({});
      await (this.prisma as any).lab.deleteMany({});

      this.logger.info('Database cleared successfully', 'SeedService');
    } catch (error) {
      this.logger.error('Failed to clear database', error, 'SeedService');
      throw error;
    }
  }

  /**
   * Reset database to initial state
   */
  async resetDatabase(config: SeedDataConfig): Promise<void> {
    try {
      this.logger.info('Resetting database to initial state', 'SeedService');
      await this.clearDatabase();
      await this.seedDatabase(config);
      this.logger.info('Database reset successfully', 'SeedService');
    } catch (error) {
      this.logger.error('Failed to reset database', error, 'SeedService');
      throw error;
    }
  }

  /**
   * Generate test data for development
   */
  async generateTestData(count: number = 10): Promise<void> {
    try {
      this.logger.info(`Generating ${count} test records for development`, 'SeedService');

      // Get first lab
      const labs = await (this.prisma as any).lab.findMany({ take: 1 });
      if (labs.length === 0) {
        throw new Error('No labs found in database');
      }

      const labId = labs[0].id;

      // Generate patients
      for (let i = 0; i < count; i++) {
        await (this.prisma as any).patient.create({
          data: {
            firstName: `Patient${i}`,
            lastName: `Test${i}`,
            email: `patient${i}@example.com`,
            phone: `555-0${String(i).padStart(3, '0')}`,
            birthDate: new Date(1990 + Math.floor(Math.random() * 30), 0, 1),
            gender: Math.random() > 0.5 ? 'male' : 'female',
            labId,
          },
        });
      }

      this.logger.info(`Generated ${count} test patients successfully`, 'SeedService');
    } catch (error) {
      this.logger.error('Failed to generate test data', error, 'SeedService');
      throw error;
    }
  }
}
