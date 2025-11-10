import { InventoryItem } from '../../domain/entities/InventoryItem';
import { IInventoryRepository } from '../../domain/interfaces/IInventoryRepository';
import { InventoryRepository } from '../../data/repositories/InventoryRepository';

export class InventoryService {
  private inventoryRepository: IInventoryRepository;

  constructor() {
    this.inventoryRepository = new InventoryRepository();
  }

  async getAllItems(): Promise<InventoryItem[]> {
    return this.inventoryRepository.findAll();
  }

  async createItem(data: any): Promise<InventoryItem> {
    const item = InventoryItem.create({ ...data, isActive: true });
    return this.inventoryRepository.create(item);
  }

  async updateItem(id: string, data: any): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findById(id);
    if (!item) throw new Error('Item not found');

    const updatedItem = InventoryItem.create({ ...item, ...data }, id);
    return this.inventoryRepository.update(updatedItem);
  }

  async deleteItem(id: string): Promise<void> {
    return this.inventoryRepository.delete(id);
  }
}
