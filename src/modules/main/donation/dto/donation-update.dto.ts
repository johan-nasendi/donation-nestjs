import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class DonationUpdatetDTO {

  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  start_date: string;

  @IsNotEmpty()
  @ApiProperty()
  end_data: string;

  @IsNotEmpty()
  @ApiProperty()
  image: string;

  @IsNotEmpty()
  @ApiProperty()
  amount_estimation: string;

  @IsNotEmpty()
  @ApiProperty()
  status: string;

  @IsNotEmpty()
  @ApiProperty()
  purpose: string;

}