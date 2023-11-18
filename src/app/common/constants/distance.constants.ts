import { Decimal } from '@prisma/client/runtime/library';

export const distanceToLatitude = {
  '2.5km': new Decimal(0.02253307855),
  '5km': new Decimal(0.04506615711),
  '10km': new Decimal(0.09013231423),
};

export const distanceToLongitude = {
  '2.5km': new Decimal(0.02246181491),
  '5km': new Decimal(0.04492362982),
  '10km': new Decimal(0.08984725965),
};
