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
import { CustomPrismaModule } from 'nestjs-prisma';
import { ThrottlerModule } from '@nestjs/throttler';
import { throttlerFactory } from './core/throttler';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  APP_PIPE,
  HttpAdapterHost,
} from '@nestjs/core';
import { validationPipeOptions } from '../util/definition';
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
import { CategoriesModule } from './features/categories/categories.module';
import { OrdersModule } from './features/orders/orders.module';
import { ChatsModule } from './features/chats/chats.module';
import { SocketModule } from './features/socket/socket.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import {
  ExtendedPrismaClientKey,
  ExtendedPrismaConfigService,
} from './core/prisma';
import { AuthorizableSocket } from './core/socket.io';
import {
  ErrorFilter,
  HttpExceptionFilter,
  PrismaExceptionFilter,
  PrismaExceptionFilterKey,
} from './common/filters';

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
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: ExtendedPrismaClientKey,
      useClass: ExtendedPrismaConfigService,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (config: ConfigService) => throttlerFactory(config),
      inject: [ConfigService],
    }),
    CaslModule.forRoot<
      UserRole,
      JWTPayloadUser,
      AuthorizableRequest | AuthorizableSocket
    >({}),
    SocketModule,
    UsersModule,
    AuthModule,
    CustomersModule,
    CouriersModule,
    ShopsModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    ChatsModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: PrismaExceptionFilterKey,
      useFactory: (httpAdapterHost: HttpAdapterHost) =>
        new PrismaExceptionFilter(httpAdapterHost),
      inject: [HttpAdapterHost],
    },
    HttpExceptionFilter,
    { provide: APP_FILTER, useClass: ErrorFilter },
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
