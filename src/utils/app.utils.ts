import { HttpStatus, ValidationPipe } from '@nestjs/common';

const PASSWORD_RULE = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const NIK_VALIDATE = /(?=.*?[0-16])/;

const PASSWORD_RULE_MESSAGE =
  'Password should have 1 upper case, lowcase letter along with a number and special character.';

const NIK_MESSAGE =
  'Nik is a number, Max 16 Number.';

const VALIDATION_PIPE = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});

export const REGEX = {
  PASSWORD_RULE,
  NIK_VALIDATE,
};

export const MESSAGES = {
  PASSWORD_RULE_MESSAGE,
  NIK_MESSAGE,
};

export const SETTINGS = {
  VALIDATION_PIPE,
};