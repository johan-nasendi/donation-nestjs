import { EntityRepository, Repository } from 'typeorm';
import { BadRequestException,ConflictException,InternalServerErrorException} from '@nestjs/common';
import { DonationtEntity } from 'src/entities/donation.entity';
import { DonationCreatetDTO } from 'src/modules/main/donation/dto/donation-create.dto';


@EntityRepository(DonationtEntity)
export class DonationRepository extends Repository<DonationtEntity> {



  async createDonation({
    fundraiser,patient,title,image,purpose,amount_estimation,status,start_date,end_date
  } : DonationCreatetDTO): Promise<DonationtEntity> {
    try {
      const data = await this.save(
        this.create({
          fundraiser,
          patient,
          title,
          image: 'default.jpg',
          purpose,
          amount_estimation,
          status,
          start_date,
          end_date,
         
        }),
      );
      return data;
    } catch (error){
      if (error.code === '23505') {
        throw new ConflictException('This is email Error.');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  } 

// async store(data: FundraiserCreatetDTO) {
//     if((await this.findAndCount({bank_account_number: data.bank_account_number}))[1] > 0)
//         throw new BadRequestException("User already exists");
//         const fundraiser = new FundraiserEntity();    
//     Object.assign(fundraiser, data);

//     return this.save(fundraiser);
// }


}