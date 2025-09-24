import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  Like,
  MongoRepository,
  ObjectLiteral,
} from 'typeorm';

export interface PaginationOptions<T> {
  page?: number;
  limit?: number;
  sortBy?: keyof T;
  order?: 'ASC' | 'DESC';
  filters?: FindOptionsWhere<T>;
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

  async find(options?: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOneOrFail(
    options: FindOneOptions<T>,
    message = 'Entity not found',
  ): Promise<T> {
    const entity = await this.repository.findOne(options);
    if (!entity) {
      throw new NotFoundException(message);
    }
    return entity;
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByIds(ids: string[]): Promise<T[]> {
    return this.repository.find({
      where: { id: In(ids) },
    });
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    await this.repository.updateOne({ id }, { $set: data });
    return this.findById(id);
  }

  async delete(id: string) {
    return this.repository.deleteOne({ id });
  }

  async findPaginated(options: PaginationOptions<T>) {
    const {
      page = 1,
      limit = 10,
      sortBy,
      order = 'ASC',
      filters = {} as FindOptionsWhere<T>,
      search,
      searchFields = [],
    } = options;

    const skip = (page - 1) * limit;

    let where: FindOptionsWhere<T> | FindOptionsWhere<T>[] = filters;

    if (search && searchFields.length > 0) {
      const searchConditions: FindOptionsWhere<T>[] = searchFields.map(
        (field) =>
          ({
            [field]: Like(`%${search}%`),
          }) as FindOptionsWhere<T>,
      );

      where = Array.isArray(where)
        ? [...where, ...searchConditions]
        : [where, ...searchConditions];
    }

    const orderOptions: FindOptionsOrder<T> =
      sortBy != null ? ({ [sortBy]: order } as any) : {};

    const [data, total] = await Promise.all([
      this.repository.find({
        where,
        skip,
        take: limit,
        order: orderOptions,
      }),
      this.repository.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
