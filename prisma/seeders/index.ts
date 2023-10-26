import { Environment } from '../../src/util/enum';
import { devSetup } from './setups';

const main = async () => {
  if (process.env.NODE_ENV.toLowerCase() === Environment.Production) {
    await devSetup();
  } else if (process.env.NODE_ENV.toLowerCase() === Environment.Development) {
    await devSetup();
  }
};

main();
