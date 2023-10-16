import { Environment } from 'src/util/enum';

export interface AppConfig {
  nodeEnv: Environment;
  apiPort: number;
  baseDomain: string;
  protocol: string;

  security: {
    secretKey: string;
    passwordSaltRounds: number;
  };

  auth: {
    cookieName: string;
    expiresIn: string;
  };

  throttler: {
    ttl: number;
    limit: number;
  };
}
