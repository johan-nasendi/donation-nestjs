import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatientDTO {


  
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  nik: string;

  @IsNotEmpty()
  @ApiProperty()
  mobile_number: string;

  @IsNotEmpty()
  @ApiProperty()
  category: string;

  @IsNotEmpty()
  @ApiProperty()
  desease: string;

  @IsNotEmpty()
  @ApiProperty()
  story: string;

  
//   @IsNotEmpty()
//   @ApiProperty()
//   slug: string;









  
}