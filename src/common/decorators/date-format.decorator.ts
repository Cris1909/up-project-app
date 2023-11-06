import { createParamDecorator, BadRequestException } from '@nestjs/common';

export const DateFormat = createParamDecorator((data: string, req) => {
  const value = req.body[data];
  if (!value || !isValidDateFormat(value)) {
    throw new BadRequestException(`El campo ${data} debe tener un formato de fecha válido (yyyy-MM-dd).`);
  }
  return value;
});

function isValidDateFormat(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}
