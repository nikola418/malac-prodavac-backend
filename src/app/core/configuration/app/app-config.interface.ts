import { Environment } from '../../../../util/enum';

export interface AppConfig {
  nodeEnv: Environment;
  apiPort: number;
  baseDomain: string;
  protocol: string;
  maxFileSizeB: number;
  multerDest: string;
  userMediaDest: string;
  productMediaDest: string;
  apkDest: string;

  security: {
    secretKey: string;
    passwordSaltRounds: number;
    apkSecret: string;
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
