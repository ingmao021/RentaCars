import {
	Body,
	Controller,
	Get,
	Headers,
	Post,
	UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	register(@Body() body: { email?: unknown; password?: unknown }) {
		return this.authService.register(body.email, body.password);
	}

	@Post('login')
	login(@Body() body: { email?: unknown; password?: unknown }) {
		return this.authService.login(body.email, body.password);
	}

	@Post('logout')
	logout(@Headers('authorization') authorization?: string) {
		this.authService.logout(this.getToken(authorization));
		return { message: 'Sesión cerrada' };
	}

	@Get('me')
	me(@Headers('authorization') authorization?: string) {
		return this.authService.getUser(this.getToken(authorization));
	}

	private getToken(authorization?: string): string {
		const match = authorization?.match(/^Bearer\s+(.+)$/i);
		if (!match) {
			throw new UnauthorizedException('Se requiere un token Bearer');
		}
		return match[1];
	}
}
