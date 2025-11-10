import { Lab } from '../../domain/entities/Lab';
import { ILabRepository } from '../../domain/interfaces/ILabRepository';
import { LabRepository } from '../../data/repositories/LabRepository';

export class LabService {
  private labRepository: ILabRepository;

  constructor() {
    this.labRepository = new LabRepository();
  }

  async getLabSettings(): Promise<Lab | null> {
    return this.labRepository.find();
  }

  async updateLabSettings(data: {
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    logo?: string;
    customText1?: string;
    customText2?: string;
  }): Promise<Lab> {
    const currentSettings = await this.getLabSettings();
    if (!currentSettings) {
      // This is a simplified approach. A real app would have a setup process.
      // For now, we'll assume a lab record always exists.
      throw new Error('Lab settings not found. Initial setup required.');
    }

    // Create a new Lab entity with the updated data
    const updatedLab = Lab.create({
      ...currentSettings, // Spread the existing properties
      ...data, // Overwrite with new data
    }, currentSettings.id);

    return this.labRepository.update(updatedLab);
  }
}
