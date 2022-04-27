import { Module } from '@nestjs/common';
import { FundraiserService } from './fundraiser.service';
import { FundraiserController } from './fundraiser.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FundraisertRepository } from 'src/repository/fundraiser.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([FundraisertRepository]),
  ],
  providers: [FundraiserService],
  controllers: [FundraiserController]
})
export class FundraiserModule {}
