import { InventoryItem } from '../../domain/entities/InventoryItem';
import { IInventoryRepository } from '../../domain/interfaces/IInventoryRepository';

export class InventoryRepository implements IInventoryRepository {
  private async query(method: string, ...args: any[]): Promise<any> {
    const { success, data, error } = await window.electronAPI.dbQuery('inventoryItem', method, ...args);
    if (!success) throw new Error(error);
    return data;
  }

  async findAll(): Promise<InventoryItem[]> {
    const data = await this.query('findMany');
    return data.map(d => InventoryItem.create(d, d.id));
  }

  async findById(id: string): Promise<InventoryItem | null> {
    const data = await this.query('findUnique', { where: { id } });
    return data ? InventoryItem.create(data, data.id) : null;
  }

  async create(entity: InventoryItem): Promise<InventoryItem> {
    const data = await this.query('create', { data: this.toPersistence(entity) });
    return InventoryItem.create(data, data.id);
  }

  async update(entity: InventoryItem): Promise<InventoryItem> {
    const data = await this.query('update', { where: { id: entity.id }, data: this.toPersistence(entity) });
    return InventoryItem.create(data, data.id);
  }

  async delete(id: string): Promise<void> {
    await this.query('delete', { where: { id } });
  }

  private toPersistence(entity: InventoryItem): any {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      description: entity.description,
      category: entity.category,
      quantity: entity.quantity,
      minQuantity: entity.minQuantity,
      unit: entity.unit,
      unitPrice: entity.unitPrice,
      supplier: entity.supplier,
      notes: entity.notes,
      isActive: entity.isActive,
    };
  }
}
