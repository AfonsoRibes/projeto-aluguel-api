import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataService } from './data.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { PropertyModule } from './modules/property/property.module';
import { UserEntity } from './database/entities/user.entity';
import { PropertyEntity } from './database/entities/property.entity';
import { LessorEntity } from './database/entities/lessor.entity';
import { RentEntity } from './database/entities/rent.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'database.sqlite',
    //   entities: [UserEntity, PropertyEntity, LessorEntity, RentEntity],
    //   synchronize: true,
    //   logging: false,
    // }),
    // DatabaseModule,
    // AuthModule,
    // UserModule,
    // PropertyModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataService],
})
export class AppModule {}
