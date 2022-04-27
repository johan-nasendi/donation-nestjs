import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { MESSAGES, REGEX } from '../../../../utils/app.utils';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @ApiProperty()
  avatar: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  confirm: string;






  
}