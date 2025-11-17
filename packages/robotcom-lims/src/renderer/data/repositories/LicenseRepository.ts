import { License } from '../../domain/entities/License';
import { ILicenseRepository } from '../../domain/interfaces/ILicenseRepository';

export class LicenseRepository implements ILicenseRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('license', method, ...args);
    if (!success) throw new Error(error || 'Database query failed');
    return data;
  }

  async find(): Promise<License | null> {
    const data = await this.query('findFirst');
    return data ? License.create(data, data.id) : null;
  }

  async save(entity: License): Promise<License> {
    // This is a simplified upsert. A real app would handle creation vs. update.
    const data = await this.query('upsert', {
      where: { id: entity.id || '' },
      update: this.toPersistence(entity),
      create: this.toPersistence(entity),
    });
    return License.create(data, data.id);
  }

  private toPersistence(entity: License): any {
    return {
      id: entity.id,
      licenseKey: entity.licenseKey,
      machineId: entity.machineId,
      subscriptionType: entity.subscriptionType,
      isActive: entity.isActive,
      activatedAt: entity.activatedAt,
      expiresAt: entity.expiresAt,
      lastCheckAt: entity.lastCheckAt,
      gracePeriodEnds: entity.gracePeriodEnds,
    };
  }
}
