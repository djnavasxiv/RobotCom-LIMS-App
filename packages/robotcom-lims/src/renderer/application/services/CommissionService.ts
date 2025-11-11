import { Commission } from '../../domain/entities/Commission';
import { ICommissionRepository } from '../../domain/interfaces/ICommissionRepository';
import { CommissionRepository } from '../../data/repositories/CommissionRepository';

export class CommissionService {
  private commissionRepository: ICommissionRepository;

  constructor() {
    this.commissionRepository = new CommissionRepository();
  }

  async getAllCommissions(): Promise<Commission[]> {
    return this.commissionRepository.findAll();
  }
}
