import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
  } from 'class-validator';
import { MESSAGES, REGEX } from '../../../../utils/app.utils';
  export class LoginInputDto {
   
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
    
  
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
    password: string;
  }
  