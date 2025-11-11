import { InventoryItem } from '../entities/InventoryItem';

export interface IInventoryRepository {
  findAll(): Promise<InventoryItem[]>;
  findById(id: string): Promise<InventoryItem | null>;
  create(entity: InventoryItem): Promise<InventoryItem>;
  update(entity: InventoryItem): Promise<InventoryItem>;
  delete(id: string): Promise<void>;
}
