import { IsNotEmpty, Length, Matches } from 'class-validator';
import { MESSAGES, REGEX } from '../../../../utils/app.utils';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {

  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  @ApiProperty()
   readonly password: string;

  @IsNotEmpty()
  @ApiProperty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MESSAGE })
  confirm: string;

}