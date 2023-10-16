import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { appConfigFactory } from '../../configuration/app/app-config.factory';
// import { AuthService } from 'src/app/features/auth/auth.service';
// import { JWTPayloadUser } from 'src/app/common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(appConfigFactory.KEY)
    private readonly config: ConfigType<typeof appConfigFactory>, // private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.cookieJwtExtractorBuilder(config),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.security.secretKey,
    });
  }

  private static cookieJwtExtractorBuilder(
    config: ConfigType<typeof appConfigFactory>,
  ) {
    return (req: Request): string => {
      return req.cookies?.[config.auth.cookieName] || null;
    };
  }

  async validate({ user }: { user: any }) {
    return user;
  }
}
