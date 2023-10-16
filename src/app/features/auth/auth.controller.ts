import {
  Controller,
  Get,
  Post,
  Inject,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigType } from '@nestjs/config';
import { ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { NoAutoSerialize, AuthUser } from 'src/app/common/decorators';
import { serializeObject } from 'src/app/common/serializers/responses';
import { JWTPayloadUser } from 'src/app/core/authentication/jwt';
import { LocalAuthGuard } from 'src/app/core/authentication/local';
import { appConfigFactory } from 'src/app/core/configuration/app';
import { Environment } from 'src/util/enum';
import { UserEntity } from '../users/entities';
import { Public } from 'src/app/common/decorators';
import { Request, Response } from 'express';
import { convertToMilliseconds } from 'src/app/common/helpers';
import { LoginDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @Inject(appConfigFactory.KEY)
    private config: ConfigType<typeof appConfigFactory>,
  ) {}

  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: UserEntity })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @NoAutoSerialize()
  login(@Req() req: Request, @Res() res: Response) {
    const { token, user } = this.authService.login(req.user as UserEntity);
    return res
      .cookie(this.config.auth.cookieName, token, {
        httpOnly: true,
        maxAge: convertToMilliseconds(this.config.auth.expiresIn),
        sameSite:
          this.config.nodeEnv === Environment.Production ? 'none' : 'lax',
        secure: this.config.nodeEnv === Environment.Production,
        domain: this.config.baseDomain,
      })
      .json(serializeObject<UserEntity>(user, UserEntity));
  }

  @Get('me')
  // @CheckAbilities({ action: Action.Read, subject: 'User' })
  async me(@AuthUser() user: JWTPayloadUser) {
    return new UserEntity(await this.authService.me(user));
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @NoAutoSerialize()
  logout(@Res() res: Response) {
    return this.authService.logout(res).status(HttpStatus.OK).send();
  }
}
