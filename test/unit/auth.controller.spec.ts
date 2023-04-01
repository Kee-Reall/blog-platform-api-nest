import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/Security/controllers';
import { CqrsModule } from '@nestjs/cqrs';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [AuthController],
    }).compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
