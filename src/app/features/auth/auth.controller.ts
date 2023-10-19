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
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { Environment } from '../../../util/enum';
import { Public, NoAutoSerialize, AuthUser } from '../../common/decorators';
import { convertToMilliseconds } from '../../common/helpers';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { LocalAuthGuard } from '../../core/authentication/local';
import { appConfigFactory } from '../../core/configuration/app';
import { UserEntity } from '../users/entities';

@ApiTags('auth')
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
    const token = this.authService.login(
      req.body.password,
      req.user as UserEntity,
    );

    return res
      .cookie(this.config.auth.cookieName, token, {
        httpOnly: true,
        maxAge: convertToMilliseconds(this.config.auth.expiresIn),
        sameSite:
          this.config.nodeEnv === Environment.Production ? 'none' : 'lax',
        secure: this.config.nodeEnv === Environment.Production,
        domain: this.config.baseDomain,
      })
      .json(plainToInstance(UserEntity, req.user));
  }

  @Get('me')
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
