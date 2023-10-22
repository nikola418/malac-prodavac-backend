import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigType } from '@nestjs/config';
import { UserEntity } from '../users/entities';
import { Response } from 'express';
import { Environment } from '../../../util/enum';
import { JWTPayloadUser } from '../../core/authentication/jwt';
import { appConfigFactory } from '../../core/configuration/app';
import { plainToInstance } from 'class-transformer';
import { convertToMilliseconds } from '../../common/helpers';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(appConfigFactory.KEY)
    private appConfig: ConfigType<typeof appConfigFactory>,
  ) {}

  private logger = new Logger(AuthService.name);

  async validateUser(email: string, password?: string) {
    return this.usersService.validateUser(email, password);
  }

  login(res: Response, user: UserEntity) {
    const serializedUser = plainToInstance(UserEntity, user);
    const payload = { user: serializedUser };

    res: res.cookie(
      this.appConfig.auth.cookieName,
      this.jwtService.sign(payload),
      {
        httpOnly: true,
        maxAge: convertToMilliseconds(this.appConfig.auth.expiresIn),
        sameSite:
          this.appConfig.nodeEnv === Environment.Production ? 'none' : 'lax',
        secure: this.appConfig.nodeEnv === Environment.Production,
        domain: this.appConfig.baseDomain,
      },
    );

    return serializedUser;
  }

  logout(res: Response) {
    return res.clearCookie(this.appConfig.auth.cookieName, {
      httpOnly: true,
      sameSite:
        this.appConfig.nodeEnv === Environment.Production ? 'none' : 'lax',
      secure: this.appConfig.nodeEnv === Environment.Production,
      domain: this.appConfig.baseDomain,
    });
  }

  me(user: JWTPayloadUser) {
    return this.usersService.findOne({ id: user.id });
  }
}
