import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { ConfigType } from '@nestjs/config';
import { appConfigFactory } from 'src/app/core/configuration/app';
import { UserEntity } from '../users/entities';
import { serializeObject } from 'src/app/common/serializers/responses';
import { Environment } from 'src/util/enum';
import { Response } from 'express';
import { JWTPayloadUser } from 'src/app/core/authentication/jwt';

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
    return serializeObject(
      new UserEntity(await this.usersService.validateUser(email, password)),
      UserEntity,
    );
  }

  login(user: UserEntity) {
    const payload = { user: user };
    return { token: this.jwtService.sign(payload), user };
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
