import { License } from '../entities/License';

export interface ILicenseRepository {
  find(): Promise<License | null>;
  save(entity: License): Promise<License>;
}
