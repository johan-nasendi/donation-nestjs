import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatienUpdatetDTO {


  
  @IsNotEmpty()
  @ApiProperty()
  name: string;

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

  
}