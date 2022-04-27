import { EntityRepository, Repository } from 'typeorm';
import { BadRequestException,ConflictException,InternalServerErrorException} from '@nestjs/common';
import { FundraiserEntity } from 'src/entities/fundraiser.entity';
import { FundraiserCreatetDTO } from 'src/modules/main/donation/dto/fundraiser-create.dto';


@EntityRepository(FundraiserEntity)
export class FundraisertRepository extends Repository<FundraiserEntity> {



  async createFundraiser({
    author, nik,mobile_number,bank_name,bank_account_name,bank_account_number
  } : FundraiserCreatetDTO): Promise<FundraiserEntity> {
    try {
      const data = await this.save(
        this.create({
         author,
          nik,
          mobile_number,
          bank_name,
          bank_account_name,
          bank_account_number
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

async store(data: FundraiserCreatetDTO) {
    if((await this.findAndCount({bank_account_number: data.bank_account_number}))[1] > 0)
        throw new BadRequestException("User already exists");
        const fundraiser = new FundraiserEntity();    
    Object.assign(fundraiser, data);

    return this.save(fundraiser);
}


}