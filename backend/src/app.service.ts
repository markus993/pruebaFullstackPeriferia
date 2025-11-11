import { Injectable } from '@nestjs/common';

export interface HealthResponse {
  ok: boolean;
  message: string;
}

@Injectable()
export class AppService {
  getHealth(): HealthResponse {
    return {
      ok: true,
      message: 'API Periferia Social operativa'
    };
  }
}
