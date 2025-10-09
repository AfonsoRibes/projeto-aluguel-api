import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyEntity } from './entities/property.entity';
import { UserEntity } from './entities/user.entity';
import { LessorEntity } from './entities/lessor.entity';
import { RentEntity } from './entities/rent.entity';
import { UserRepository } from './repositories/user.repository';

const entities = [UserEntity, PropertyEntity, LessorEntity, RentEntity];

const repositories = [UserRepository];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...repositories],
  exports: [...repositories, TypeOrmModule],
})
export class DatabaseModule {}
