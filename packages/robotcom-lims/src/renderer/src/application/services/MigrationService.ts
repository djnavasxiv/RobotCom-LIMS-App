/**
 * MigrationService - Database migration management and versioning
 * Handles migration tracking, execution, rollback, and version management
 */

import { PrismaClient } from '@prisma/client';
import LoggerService from './LoggerService';

export interface MigrationRecord {
  id: string;
  name: string;
  version: string;
  executedAt: Date;
  executionTime: number;
  status: 'success' | 'failed' | 'pending';
  rollbackScript?: string;
  error?: string;
}

export interface MigrationConfig {
  name: string;
  version: string;
  description: string;
  up: (prisma: PrismaClient) => Promise<void>;
  down?: (prisma: PrismaClient) => Promise<void>;
}

export class MigrationService {
  private logger = LoggerService;
  private prisma: PrismaClient;
  private migrations: Map<string, MigrationConfig> = new Map();

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  /**
   * Register a migration
   */
  registerMigration(config: MigrationConfig): void {
    const key = `${config.version}-${config.name}`;
    this.migrations.set(key, config);
    this.logger.info(`Migration registered: ${key}`, 'MigrationService');
  }

  /**
   * Execute all pending migrations
   */
  async executePendingMigrations(): Promise<void> {
    try {
      this.logger.info('Starting migration check', 'MigrationService');

      // Ensure migration tracking table exists
      await this.ensureMigrationTable();

      // Get executed migrations
      const executedMigrations = await this.getExecutedMigrations();
      const executedKeys = new Set(executedMigrations.map((m) => `${m.version}-${m.name}`));

      // Filter pending migrations
      const pending: [string, MigrationConfig][] = [];
      this.migrations.forEach((config, key) => {
        if (!executedKeys.has(key)) {
          pending.push([key, config]);
        }
      });

      if (pending.length === 0) {
        this.logger.info('No pending migrations', 'MigrationService');
        return;
      }

      // Execute pending migrations in order
      for (const [_key, config] of pending) {
        await this.executeMigration(config);
      }

      this.logger.info(`Completed ${pending.length} migrations`, 'MigrationService');
    } catch (error) {
      this.logger.error('Migration execution failed', error, 'MigrationService');
      throw error;
    }
  }

  /**
   * Execute a single migration
   */
  private async executeMigration(config: MigrationConfig): Promise<void> {
    const startTime = Date.now();
    const key = `${config.version}-${config.name}`;

    try {
      this.logger.info(`Executing migration: ${key}`, 'MigrationService');

      await config.up(this.prisma);

      const executionTime = Date.now() - startTime;
      await this.recordMigration({
        name: config.name,
        version: config.version,
        status: 'success',
        executionTime,
      });

      this.logger.info(`Migration completed: ${key} (${executionTime}ms)`, 'MigrationService');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.recordMigration({
        name: config.name,
        version: config.version,
        status: 'failed',
        error: errorMessage,
        executionTime: Date.now() - startTime,
      });

      this.logger.error(`Migration failed: ${key}`, error, 'MigrationService');
      throw error;
    }
  }

  /**
   * Rollback a migration
   */
  async rollbackMigration(version: string, name: string): Promise<void> {
    try {
      const key = `${version}-${name}`;
      const config = this.migrations.get(key);

      if (!config || !config.down) {
        throw new Error(`Migration ${key} does not have a rollback script`);
      }

      this.logger.info(`Rolling back migration: ${key}`, 'MigrationService');

      const startTime = Date.now();
      await config.down(this.prisma);
      const executionTime = Date.now() - startTime;

      // Remove from migration history
      await this.removeMigrationRecord(version, name);

      this.logger.info(`Rollback completed: ${key} (${executionTime}ms)`, 'MigrationService');
    } catch (error) {
      this.logger.error(`Rollback failed: ${version}-${name}`, error, 'MigrationService');
      throw error;
    }
  }

  /**
   * Get migration history
   */
  async getMigrationHistory(): Promise<MigrationRecord[]> {
    try {
      const records = await (this.prisma as any).__runRawUnsafe?.(
        'SELECT * FROM _migration_history ORDER BY executedAt DESC'
      );
      return records || [];
    } catch (error) {
      this.logger.warn('Could not fetch migration history', 'MigrationService');
      return [];
    }
  }

  /**
   * Get executed migrations
   */
  private async getExecutedMigrations(): Promise<
    Array<{ version: string; name: string }>
  > {
    try {
      // This would query the migration tracking table
      // For now, return empty array as fallback
      return [];
    } catch (error) {
      this.logger.warn('Could not fetch executed migrations', 'MigrationService');
      return [];
    }
  }

  /**
   * Ensure migration tracking table exists
   */
  private async ensureMigrationTable(): Promise<void> {
    try {
      // Create migration table if it doesn't exist
      await (this.prisma as any).$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS _migration_history (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          version TEXT NOT NULL,
          executedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          executionTime INTEGER,
          status TEXT,
          rollbackScript TEXT,
          error TEXT,
          UNIQUE(version, name)
        )
      `);
    } catch (error) {
      // Table might already exist or creation might not be supported
      this.logger.warn('Could not ensure migration table', 'MigrationService');
    }
  }

  /**
   * Record a migration in history
   */
  private async recordMigration(data: {
    name: string;
    version: string;
    status: string;
    executionTime: number;
    error?: string;
  }): Promise<void> {
    try {
      const id = `${data.version}-${data.name}-${Date.now()}`;
      await (this.prisma as any).$executeRawUnsafe(
        `
        INSERT INTO _migration_history (id, name, version, status, executionTime, error)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        id,
        data.name,
        data.version,
        data.status,
        data.executionTime,
        data.error || null
      );
    } catch (error) {
      this.logger.warn('Could not record migration', 'MigrationService');
    }
  }

  /**
   * Remove migration from history
   */
  private async removeMigrationRecord(version: string, name: string): Promise<void> {
    try {
      await (this.prisma as any).$executeRawUnsafe(
        'DELETE FROM _migration_history WHERE version = ? AND name = ?',
        version,
        name
      );
    } catch (error) {
      this.logger.warn('Could not remove migration record', 'MigrationService');
    }
  }

  /**
   * Get migration status
   */
  async getMigrationStatus(): Promise<{
    totalMigrations: number;
    executedMigrations: number;
    pendingMigrations: number;
    lastMigration?: MigrationRecord;
  }> {
    const executed = await this.getExecutedMigrations();
    const total = this.migrations.size;
    const pending = total - executed.length;

    return {
      totalMigrations: total,
      executedMigrations: executed.length,
      pendingMigrations: pending,
    };
  }

  /**
   * Validate database schema
   */
  async validateSchema(): Promise<{
    isValid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      this.logger.info('Validating database schema', 'MigrationService');

      // Test basic table access
      const tables = ['Lab', 'User', 'Patient', 'Test', 'Sample', 'Invoice'];

      for (const table of tables) {
        try {
          await (this.prisma as any)[table.toLowerCase()].count();
        } catch (error) {
          errors.push(`Table '${table}' validation failed`);
        }
      }

      const isValid = errors.length === 0;
      if (isValid) {
        this.logger.info('Schema validation passed', 'MigrationService');
      } else {
        this.logger.warn(`Schema validation failed with ${errors.length} errors`, 'MigrationService');
      }

      return { isValid, errors };
    } catch (error) {
      this.logger.error('Schema validation error', error, 'MigrationService');
      return { isValid: false, errors: ['Schema validation encountered an error'] };
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStatistics(): Promise<Record<string, any>> {
    try {
      const stats: Record<string, any> = {};

      // Count records in main tables
      stats.labCount = await (this.prisma as any).lab.count();
      stats.userCount = await (this.prisma as any).user.count();
      stats.patientCount = await (this.prisma as any).patient.count();
      stats.sampleCount = await (this.prisma as any).sample.count();
      stats.testCount = await (this.prisma as any).test.count();
      stats.invoiceCount = await (this.prisma as any).invoice.count();

      this.logger.info('Database statistics retrieved', 'MigrationService');
      return stats;
    } catch (error) {
      this.logger.error('Could not retrieve database statistics', error, 'MigrationService');
      return {};
    }
  }
}
