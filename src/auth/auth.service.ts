import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

interface User {
  id: string;
  email: string;
  passwordHash: string;
}

export interface PublicUser {
  id: string;
  email: string;
}

@Injectable()
export class AuthService {
  private readonly usersByEmail = new Map<string, User>();
  private readonly usersById = new Map<string, User>();
  private readonly sessions = new Map<string, string>();

  async register(emailInput: unknown, passwordInput: unknown) {
    const { email, password } = this.validateCredentials(
      emailInput,
      passwordInput,
    );

    if (this.usersByEmail.has(email)) {
      throw new ConflictException('El correo ya está registrado');
    }

    const salt = randomBytes(16).toString('hex');
    const hash = await this.hashPassword(password, salt);
    const user: User = {
      id: randomBytes(16).toString('hex'),
      email,
      passwordHash: `${salt}:${hash.toString('hex')}`,
    };

    this.usersByEmail.set(email, user);
    this.usersById.set(user.id, user);
    return this.createSession(user);
  }

  async login(emailInput: unknown, passwordInput: unknown) {
    const { email, password } = this.validateCredentials(
      emailInput,
      passwordInput,
    );
    const user = this.usersByEmail.get(email);

    if (!user || !(await this.passwordMatches(password, user.passwordHash))) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    return this.createSession(user);
  }

  getUser(token: string): PublicUser {
    const userId = this.sessions.get(token);
    const user = userId ? this.usersById.get(userId) : undefined;
    if (!user) {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }
    return this.toPublicUser(user);
  }

  logout(token: string): void {
    if (!this.sessions.delete(token)) {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }
  }

  private validateCredentials(
    emailInput: unknown,
    passwordInput: unknown,
  ): { email: string; password: string } {
    if (typeof emailInput !== 'string' || typeof passwordInput !== 'string') {
      throw new BadRequestException('Correo y contraseña son obligatorios');
    }

    const email = emailInput.trim().toLowerCase();
    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      passwordInput.length < 8 ||
      passwordInput.length > 128
    ) {
      throw new BadRequestException(
        'Usa un correo válido y una contraseña de 8 a 128 caracteres',
      );
    }

    return { email, password: passwordInput };
  }

  private createSession(user: User) {
    const token = randomBytes(32).toString('hex');
    this.sessions.set(token, user.id);
    return { user: this.toPublicUser(user), token };
  }

  private toPublicUser(user: User): PublicUser {
    return { id: user.id, email: user.email };
  }

  private hashPassword(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      scrypt(password, salt, 64, (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey);
      });
    });
  }

  private async passwordMatches(
    password: string,
    storedHash: string,
  ): Promise<boolean> {
    const [salt, hashHex] = storedHash.split(':');
    if (!salt || !hashHex) return false;

    const expectedHash = Buffer.from(hashHex, 'hex');
    const actualHash = await this.hashPassword(password, salt);
    return (
      expectedHash.length === actualHash.length &&
      timingSafeEqual(expectedHash, actualHash)
    );
  }
}