import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class DonationCreatetDTO {


  @IsNotEmpty()
  @ApiProperty()
  fundraiser: number ;

  @IsNotEmpty()
  @ApiProperty()
  patient: number ;

  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  start_date: Date;

  @IsNotEmpty()
  @ApiProperty()
  end_date: Date;


  @ApiProperty()
  image: string;

  @IsNotEmpty()
  @ApiProperty()
  amount_estimation: string;

  @ApiProperty()
  status: string;

  @IsNotEmpty()
  @ApiProperty()
  purpose: string;

}