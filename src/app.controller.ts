import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { AppService } from './app.service';
import { Auth } from './auth/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Auth()
  @ApiOperation({summary: 'Ruta para obtener el estado de la api'})
  getHello() {
    return this.appService.getHello();
  }
}
