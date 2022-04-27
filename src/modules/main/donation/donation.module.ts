import { Module } from '@nestjs/common';
import { FundraiserModule } from './fundraiser/fundraiser.module';
import { PatientModule } from './patient/patient.module';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonationRepository } from 'src/repository/donation.repositoy';

@Module({
  imports: [TypeOrmModule.forFeature([DonationRepository]),
    FundraiserModule, PatientModule],
  controllers: [DonationController],
  providers: [DonationService]
})
export class DonationModule {}
