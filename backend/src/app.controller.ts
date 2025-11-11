import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import type { HealthResponse } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Verificar estado del servicio',
    description: 'Retorna un indicador simple para confirmar que el backend está operativo.',
  })
  @Get('health')
  getHealth(): HealthResponse {
    return this.appService.getHealth();
  }
}
