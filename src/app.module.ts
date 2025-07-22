import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CampaignModule } from './campaign/campaign.module';
import { Campaign } from './entities/campaign/campaign.entity';
import { User } from './entities/user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_URI,
      database: 'nest-auth',
      entities: [User, Campaign],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Campaign]),
    AuthModule,
    CampaignModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
