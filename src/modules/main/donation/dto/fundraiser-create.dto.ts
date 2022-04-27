import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../../auth/dto/create-user.dto';

export class FundraiserCreatetDTO {


  @IsNotEmpty()
  @ApiProperty()
  author: number ;

  @IsNotEmpty()
  @ApiProperty()
  nik: string;

  @IsNotEmpty()
  @ApiProperty()
  mobile_number: string;

  @IsNotEmpty()
  @ApiProperty()
  bank_name: string;

  @IsNotEmpty()
  @ApiProperty()
  bank_account_number: string;

  @IsNotEmpty()
  @ApiProperty()
  bank_account_name: string;

  
//   @IsNotEmpty()
//   @ApiProperty()
//   slug: string;









  
}