import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { PatientEntity } from 'src/entities/patient.entity';
import { PatientRepository } from 'src/repository/patient.repository';
import { PatienUpdatetDTO } from '../dto/patient-update.dto';
import { PatientDTO } from '../dto/patient.dto';
import { PatientInterface } from '../interface/patient.interface';
import {
    paginate,
    Pagination,
    IPaginationOptions,
  } from 'nestjs-typeorm-paginate';


@Injectable()
export class PatientService {

    constructor(@InjectRepository(PatientRepository)
        private readonly patientRepository : PatientRepository,
    ){}

    async create(patientDTO : PatientDTO) : Promise<{ok: boolean}> {
        const patient = await this.patientRepository.createPatient(patientDTO);
        await this.patientRepository.save(patient)
        return {
            ok: true
        }
    }

    async update(id: string, userUpdateDTO: PatienUpdatetDTO): Promise<PatientEntity> {
        let toUpdate = await this.patientRepository.findOne(id)
        let updated = Object.assign(toUpdate, userUpdateDTO);
        return await this.patientRepository.save(updated);
    }

    async remove(id: string) {
        await this.patientRepository.delete(id);
        return {deleted: true}
    }
    
    findAll(): Promise<PatientEntity[]> {
        return this.patientRepository.find();
     }
  
     findOne(id: number): Observable<PatientInterface> {
        return from(this.patientRepository.findOne({id}));
    }

    paginateAll(options: IPaginationOptions): Observable<Pagination<PatientInterface>> {
        return from(paginate<PatientEntity>(this.patientRepository, options))
    }


}
