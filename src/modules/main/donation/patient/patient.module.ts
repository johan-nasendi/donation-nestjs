import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientRepository } from 'src/repository/patient.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientRepository])
  ],
  providers: [PatientService],
  controllers: [PatientController]
})
export class PatientModule {}
