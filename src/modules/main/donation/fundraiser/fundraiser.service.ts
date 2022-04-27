import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FundraiserEntity } from 'src/entities/fundraiser.entity';
import { FundraisertRepository } from 'src/repository/fundraiser.repository';
import { FundraiserCreatetDTO } from '../dto/fundraiser-create.dto';
import { FundraiserUpdatetDTO } from '../dto/fundraiser-update.dto';
import {
    paginate,
    Pagination,
    IPaginationOptions,
  } from 'nestjs-typeorm-paginate';

import { from, map, Observable } from 'rxjs';
import { FundraiserInterface } from '../interface/fundraiser.interface';


@Injectable()
export class FundraiserService {

    constructor(@InjectRepository(FundraisertRepository)
        private readonly fundraiserRepository : FundraisertRepository,

    ) {}


    async create(fundraiserCreateDTO : FundraiserCreatetDTO) : Promise<any> {
        const patient = await this.fundraiserRepository.createFundraiser(fundraiserCreateDTO);
        await this.fundraiserRepository.save(patient)
    }

    async update(id: string, fundUpdateDTO: FundraiserUpdatetDTO): Promise<FundraiserEntity> {
        let toUpdate = await this.fundraiserRepository.findOne(id)
        let updated = Object.assign(toUpdate, fundUpdateDTO);
        return await this.fundraiserRepository.save(updated);
    }

    async remove(id: string) {
        await this.fundraiserRepository.delete(id);
        return {deleted: true}
    }
    
    findAll() : Observable<FundraiserInterface[]> {
        return from(this.fundraiserRepository.find(
            {relations: ['author']},
        ));
    }
  
    findOne(id: number): Observable<FundraiserInterface> {
        return from(this.fundraiserRepository.findOne({id}, {relations: ['author']}));
    }


      paginateAll(options: IPaginationOptions): Observable<Pagination<FundraiserInterface>> {
        return from(paginate<FundraiserEntity>(this.fundraiserRepository, options, {
            relations: ['author']
        })).pipe(
            map((blogEntries: Pagination<FundraiserInterface>) => blogEntries)
        )
    }
    
    paginateByUser(options: IPaginationOptions, userId: number): Observable<Pagination<FundraiserInterface>> {
        return from(paginate<FundraiserEntity>(this.fundraiserRepository, options, {
            relations: ['author'],
            where: [
                {author: userId},
                
            ]
        })).pipe(
            map((blogEntries: Pagination<FundraiserInterface>) => blogEntries)
        )
    }


 }
