import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfigFactory } from './core/configuration/app';
import { prismaConfigFactory } from './core/configuration/prisma';
import {
  AuthorizableRequest,
  JWTPayloadUser,
  JwtAuthGuard,
  jwtFactory,
} from './core/authentication/jwt';
import { JwtModule } from '@nestjs/jwt';
import {
  PrismaModule,
  providePrismaClientExceptionFilter,
} from 'nestjs-prisma';
import { prismaFactory } from './core/prisma';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerFactory } from './core/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import {
  prismaKnownClientExceptionMappings,
  validationPipeOptions,
} from '../util/definition';
import { Module, ValidationPipe } from '@nestjs/common';
import { ResponseSerializerInterceptor } from './common/interceptors';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { CustomersModule } from './features/customers/customers.module';
import { CouriersModule } from './features/couriers/couriers.module';
import { ShopsModule } from './features/shops/shops.module';
import { ProductsModule } from './features/products/products.module';
import { CaslModule } from 'nest-casl';
import { UserRole } from '@prisma/client';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      expandVariables: true,
      envFilePath: '.env',
      isGlobal: true,
      load: [appConfigFactory, prismaConfigFactory],
    }),
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => jwtFactory(config),
      inject: [ConfigService],
    }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: (config: ConfigService) => prismaFactory(config),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => throttlerFactory(config),
      inject: [ConfigService],
    }),
    CaslModule.forRoot<UserRole, JWTPayloadUser, AuthorizableRequest>({}),
    MulterModule.register({
      dest: './upload',
    }),
    UsersModule,
    AuthModule,
    CustomersModule,
    CouriersModule,
    ShopsModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [
    providePrismaClientExceptionFilter(prismaKnownClientExceptionMappings),
    // {
    //   provide: APP_FILTER,
    //   useClass: ThrottlerExceptionFilter,
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: JwtExceptionFilter,
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe(validationPipeOptions),
    },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // { provide: APP_GUARD, useClass: ThrottlerBehindProxyGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseSerializerInterceptor },
  ],
})
export class AppModule {}
