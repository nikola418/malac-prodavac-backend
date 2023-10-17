import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/app/features/auth/auth.service';
import { UserEntity } from 'src/app/features/users/entities';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  private readonly logger = new Logger(LocalStrategy.name);

  async validate(email: string, password: string) {
    this.logger.log(
      `[LocalStrategy] validate: email=${email}, password=${password}`,
    );
    return new UserEntity(await this.authService.validateUser(email, password));
  }
}
