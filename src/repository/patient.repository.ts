import { EntityRepository, Repository } from 'typeorm';
import { ConflictException,InternalServerErrorException} from '@nestjs/common';
import { PatientEntity } from 'src/entities/patient.entity';
import { PatientDTO } from 'src/modules/main/donation/dto/patient.dto';


@EntityRepository(PatientEntity)
export class PatientRepository extends Repository<PatientEntity> {

  async createPatient({
    name, nik,mobile_number,category,desease,story
  } : PatientDTO): Promise<PatientEntity> {
    try {
      const data = await this.save(
        this.create({
          name,
          nik,
          mobile_number,
          category,
          desease,
          story
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


}