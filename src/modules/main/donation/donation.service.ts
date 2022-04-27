import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { DonationtEntity } from 'src/entities/donation.entity';
import { DonationRepository } from 'src/repository/donation.repositoy';
import { DonationCreatetDTO } from './dto/donation-create.dto';
import { DonationUpdatetDTO } from './dto/donation-update.dto';
import { DonationInterface } from './interface/donation.interface';
import {
    paginate,
    Pagination,
    IPaginationOptions,
  } from 'nestjs-typeorm-paginate';

@Injectable()
export class DonationService {

    constructor(@InjectRepository(DonationRepository)
        private readonly donationRepository : DonationRepository
    ) {}


    async create(donationCreateDTO : DonationCreatetDTO) : Promise<{ok: boolean}> {
        const donation = await this.donationRepository.createDonation(donationCreateDTO);
        await this.donationRepository.save(donation)
        return {
            ok: true
        }
    }

    async update(id: string, donationUpdateDTO: DonationUpdatetDTO): Promise<DonationtEntity> {
        let toUpdate = await this.donationRepository.findOne(id)
        let updated = Object.assign(toUpdate, donationUpdateDTO);
        return await this.donationRepository.save(updated);
    }

    async remove(id: string) {
        await this.donationRepository.delete(id);
        return {deleted: true}
    }

        findAll() : Observable<DonationtEntity[]> {
            return from(this.donationRepository.find(
                {relations: ['fundraiser','patient']},
            ));
        }
  
        findOne(id: number): Observable<DonationInterface> {
            return from(this.donationRepository.findOne({id}, {relations: ['fundraiser','patient']}));
        }



        paginateAll(options: IPaginationOptions): Observable<Pagination<DonationInterface>> {
            return from(paginate<DonationtEntity>(this.donationRepository, options, {
                relations: ['fundraiser','patient']
            })).pipe(
                map((donationEntries: Pagination<DonationInterface>) => donationEntries)
            )
        }
        
        paginateByUser(options: IPaginationOptions, userId: number): Observable<Pagination<DonationInterface>> {
            return from(paginate<DonationtEntity>(this.donationRepository, options, {
                relations: ['fundraiser','patient'],
                where: [
                    {fundraiser: userId},
                    
                ]
            })).pipe(
                map((donationEntries: Pagination<DonationInterface>) => donationEntries)
            )
        }

    }