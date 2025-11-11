import { machineIdSync } from 'node-machine-id';
import { License } from '../../domain/entities/License';
import { ILicenseRepository } from '../../domain/interfaces/ILicenseRepository';
import { LicenseRepository } from '../../data/repositories/LicenseRepository';

export class LicenseService {
  private readonly GRACE_PERIOD_DAYS = 7;
  private readonly KEYGEN_ACCOUNT_ID = 'b3d4a3a0-4214-4731-97b7-63ebb4c1e457'; // Dummy UUID
  private readonly KEYGEN_API_URL = 'https://api.keygen.sh/v1';
  private licenseRepository: ILicenseRepository;

  constructor() {
    this.licenseRepository = new LicenseRepository();
  }

  public getMachineId(): string {
    return machineIdSync();
  }

  public async validateOnline(licenseKey: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.KEYGEN_API_URL}/accounts/${this.KEYGEN_ACCOUNT_ID}/licenses/actions/validate-key`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            meta: {
              key: licenseKey,
              scope: { fingerprint: this.getMachineId() }
            }
          })
        }
      );
      const data = await response.json();
      return data.meta?.valid === true;
    } catch (error) {
      console.error('License validation failed:', error);
      return false;
    }
  }

  public async activateLicense(licenseKey: string): Promise<{ success: boolean; expiresAt?: Date; error?: string; }> {
    try {
      const hostname = await window.electronAPI.getHostname();
      const response = await fetch(
        `${this.KEYGEN_API_URL}/accounts/${this.KEYGEN_ACCOUNT_ID}/machines`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `License ${licenseKey}`
          },
          body: JSON.stringify({
            data: {
              type: 'machines',
              attributes: {
                fingerprint: this.getMachineId(),
                platform: 'electron', // Simplified
                name: hostname
              },
              relationships: {
                license: { data: { type: 'licenses', id: licenseKey } }
              }
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const expires = data.data.relationships.license.data.attributes.expiry;
        const license = License.create({
          licenseKey,
          machineId: this.getMachineId(),
          subscriptionType: 'TBD', // This would come from the API response
          isActive: true,
          activatedAt: new Date(),
          expiresAt: new Date(expires),
          lastCheckAt: new Date(),
        });
        await this.licenseRepository.save(license);
        return { success: true, expiresAt: new Date(expires) };
      } else {
        const error = await response.json();
        return { success: false, error: error.errors?.[0]?.detail || 'Activation failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error during activation' };
    }
  }

  public async getLocalLicense(): Promise<License | null> {
    return this.licenseRepository.find();
  }

  public needsOnlineCheck(lastCheckDate: Date): boolean {
    const daysSince = Math.ceil((Date.now() - lastCheckDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSince >= 7;
  }
}
