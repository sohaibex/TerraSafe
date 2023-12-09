import {
  Repository,
  SelectQueryBuilder,
  EntityTarget,
  DeepPartial,
  EntityManager,
  IsNull,
  Not, FindOneOptions
} from "typeorm";
import { BaseEntity } from "../entities/base.entity";

export abstract class BaseRepository<Entity extends BaseEntity> extends Repository<Entity> {

  // Create and Save
  async createAndSave(data: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.create(data);
    return await this.save(entity);
  }

  // Find by ID
  async findOneById(id: number): Promise<Entity | undefined> {
    const options = { where: { id: id as any } } as FindOneOptions<Entity>;
    return await this.findOne(options);
  }


  // Find All Entries
  async findAll(): Promise<Entity[]> {
    return await this.find();
  }

  // Find by Given Conditions
  async findByConditions(conditions: any): Promise<Entity[]> {
    return await this.find({ where: conditions });
  }


  // Update an Entry by ID
  async updateById(id: number, data: any): Promise<Entity> {
    await this.update(id, data);
    return this.findOneById(id);
  }

  // Delete an Entry by ID (Soft Delete)
  async deleteById(id: number): Promise<void> {
    await this.softDelete(id);
  }

  // Restore Soft Deleted Entry by ID
  async restoreById(id: number): Promise<void> {
    await this.restore(id);
  }

  async findAllNonDeleted(): Promise<Entity[]> {
    return this.find({ where: { deletedAt: IsNull() } as any });
  }

  async findAllDeleted(): Promise<Entity[]> {
    return this.find({ where: { deletedAt: Not(IsNull()) } as any });
  }

  // Check if an Entry Exists by ID
  async exists(id: number): Promise<boolean> {
    const count = await this.count({ where: { id: id as any } });
    return count > 0;
  }
}
