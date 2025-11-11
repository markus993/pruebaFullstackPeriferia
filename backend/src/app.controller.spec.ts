import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('debería retornar el estado de salud de la API', () => {
      expect(appController.getHealth()).toEqual({
        ok: true,
        message: 'API Periferia Social operativa',
      });
    });
  });
});
