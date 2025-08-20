import { ObjectId } from 'mongodb';
import {
  DeepPartial,
  FindOptionsWhere,
  MongoRepository,
  ObjectLiteral,
} from 'typeorm';

export interface PaginationOptions<T> {
  page?: number;
  limit?: number;
  sortBy?: keyof T;
  order?: 'ASC' | 'DESC';
  filters?: Partial<Record<keyof T, any>>;
  search?: string;
  searchFields?: (keyof T)[];
}

export class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repository: MongoRepository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findById(id: string): Promise<T | null> {
    const objectId = new ObjectId(id);
    return this.repository.findOne({ where: { _id: objectId } as any });
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const objectId = new ObjectId(id);
    await this.repository.updateOne({ _id: objectId } as any, { $set: data });
    return this.findById(id);
  }

  async delete(id: string) {
    const objectId = new ObjectId(id);
    return this.repository.deleteOne({ _id: objectId } as any);
  }

  async findPaginated(options: PaginationOptions<T>) {
    const {
      page = 1,
      limit = 10,
      sortBy,
      order = 'ASC',
      filters = {},
      search,
      searchFields = [],
    } = options;

    const where: FindOptionsWhere<T>[] = [];

    // 🔍 Filtros exatos
    if (Object.keys(filters).length > 0) {
      where.push(filters as any);
    }

    // 🔍 Busca textual
    if (search && searchFields.length > 0) {
      const regex = new RegExp(search, 'i');
      where.push({
        $or: searchFields.map((field) => ({
          [field as string]: { $regex: regex },
        })),
      } as any);
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.repository.find({
        where:
          where.length > 0
            ? where.length === 1
              ? where[0]
              : { $and: where }
            : {},
        skip,
        take: limit,
        order: sortBy ? { [sortBy as string]: order } : undefined,
      } as any),
      this.repository.count(
        where.length > 0
          ? where.length === 1
            ? where[0]
            : { $and: where }
          : {},
      ),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
