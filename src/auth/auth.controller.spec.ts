import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('registers a user and returns a session token', async () => {
    const result = await controller.register({
      email: 'driver@example.com',
      password: 'secure-pass-123',
    });

    expect(result.user.email).toBe('driver@example.com');
    expect(result.token).toMatch(/^[a-f0-9]{64}$/);
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('authenticates a registered user', async () => {
    await controller.register({
      email: 'driver@example.com',
      password: 'secure-pass-123',
    });

    const result = await controller.login({
      email: 'DRIVER@example.com',
      password: 'secure-pass-123',
    });

    expect(result.user.email).toBe('driver@example.com');
  });
});
