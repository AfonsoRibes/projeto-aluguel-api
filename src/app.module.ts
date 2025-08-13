import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Campaign } from './entities/campaign/campaign.entity';
import { UserEntity } from './entities/user/user.entity';
import { CampaignModule } from './modules/campaign/campaign.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI,
      database: 'nest-auth',
      entities: [UserEntity, Campaign],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([UserEntity, Campaign]),
    AuthModule,
    CampaignModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
