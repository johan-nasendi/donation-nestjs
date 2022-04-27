import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FundraiserUpdatetDTO {


  
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