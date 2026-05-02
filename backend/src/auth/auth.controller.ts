import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Permissions } from './permissions.decorator';
import { Permission } from './permissions.enum';
import { PermissionsGuard } from './permissions.guard';
import CONSTANTS from '../common/constants';

type RefreshRequestBody = {
  refresh_token?: string;
};

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request (e.g. email or phone missing, user exists)',
  })
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login an existing user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in, returns JWT token',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Invalid credentials)',
  })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.phone, body.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request OTP for a phone number' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { phone: { type: 'string', example: '01000000000' } },
    },
  })
  @ApiResponse({ status: 200, description: 'OTP sent' })
  async requestOtp(@Body() body: { phone: string }) {
    await this.authService.requestOtp(body.phone);
    return { message: 'OTP sent successfully' };
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', example: '01000000000' },
        otp: { type: 'string', example: '123456' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'OTP verified, returns JWT' })
  async verifyOtp(
    @Body() body: { phone: string; otp: string },
  ): Promise<unknown> {
    return (await this.authService.verifyOtp(body.phone, body.otp)) as unknown;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refresh_token: {
          type: 'string',
          description:
            'Refresh token. Can also be provided via Authorization Bearer header instead.',
        },
      },
    },
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Invalid or expired refresh token)',
  })
  async refresh(
    @Req() req: { headers: Record<string, string | string[] | undefined> },
    @Body() body: RefreshRequestBody,
  ) {
    const authHeader = req.headers.authorization;
    let token = body.refresh_token;

    if (
      !token &&
      typeof authHeader === 'string' &&
      authHeader.startsWith('Bearer ')
    ) {
      token = authHeader.split(' ')[1];
    }

    if (
      !token &&
      Array.isArray(authHeader) &&
      authHeader[0]?.startsWith('Bearer ')
    ) {
      token = authHeader[0].split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedException('Refresh token is required');
    }

    return this.authService.refreshToken(token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.AUTH_LOGOUT)
  @ApiBearerAuth(CONSTANTS.ACCESS_TOKEN)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Invalid or missing token)',
  })
  logout() {
    // In a stateless JWT setup, logout is primarily handled by the client
    // clearing the token. We provide this endpoint for completeness, hooks,
    // or if we later decide to implement token blacklisting/cookie clearing.
    return true;
  }
}
