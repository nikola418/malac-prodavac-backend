/* eslint-disable */
export default async () => {
  const t = {
    ['./util/enum/environment.enum']: await import(
      './util/enum/environment.enum'
    ),
    ['./app/features/users/entities/user.entity']: await import(
      './app/features/users/entities/user.entity'
    ),
    ['@prisma/client/runtime/library']: await import(
      '@prisma/client/runtime/library'
    ),
    ['./app/features/buyers/entities/buyer.entity']: await import(
      './app/features/buyers/entities/buyer.entity'
    ),
    ['./app/features/deliverers/entities/deliverer.entity']: await import(
      './app/features/deliverers/entities/deliverer.entity'
    ),
    ['./app/features/sellers/entities/seller.entity']: await import(
      './app/features/sellers/entities/seller.entity'
    ),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('./app/core/configuration/app/app-config.dto'),
          {
            AppConfigDto: {
              NODE_ENV: {
                required: true,
                enum: t['./util/enum/environment.enum'].Environment,
              },
              PROTOCOL: { required: true, type: () => String },
              BASE_DOMAIN: { required: true, type: () => String },
              API_PORT: {
                required: true,
                type: () => Number,
                minimum: 1,
                maximum: 65535,
              },
              SECRET_KEY: { required: true, type: () => String, minLength: 32 },
              SALT_ROUNDS: { required: false, type: () => Number, minimum: 10 },
              COOKIE_NAME: { required: true, type: () => String },
              EXPIRES_IN: { required: true, type: () => String },
              THROTTLER_TTL: { required: true, type: () => Number, minimum: 1 },
              THROTTLER_LIMIT: {
                required: true,
                type: () => Number,
                minimum: 0,
              },
            },
          },
        ],
        [
          import('./app/core/configuration/prisma/prisma-config.dto'),
          {
            PrismaConfigDto: {
              PRISMA_LOGS: { required: true, type: () => Object },
              POSTGRES_DATABASE_URL: { required: true, type: () => String },
              PRISMA_EXPLICIT_CONN: { required: true, type: () => Boolean },
            },
          },
        ],
        [
          import('./app/features/buyers/entities/buyer.entity'),
          {
            BuyerEntity: {
              id: { required: true, type: () => Number },
              userId: { required: true, type: () => Number },
              paymentMethod: { required: true, type: () => Object },
              updatedAt: { required: true, type: () => Date },
              createdAt: { required: true, type: () => Date },
              user: {
                required: false,
                type: () =>
                  t['./app/features/users/entities/user.entity'].UserEntity,
              },
            },
          },
        ],
        [
          import('./app/features/deliverers/entities/deliverer.entity'),
          {
            DelivererEntity: {
              id: { required: true, type: () => Number },
              userId: { required: true, type: () => Number },
              pricePerKilometer: {
                required: true,
                type: () => t['@prisma/client/runtime/library'].Decimal,
              },
              currency: { required: true, type: () => String },
              updatedAt: { required: true, type: () => Date },
              createdAt: { required: true, type: () => Date },
              user: {
                required: false,
                type: () =>
                  t['./app/features/users/entities/user.entity'].UserEntity,
              },
            },
          },
        ],
        [
          import('./app/features/sellers/entities/seller.entity'),
          {
            SellerEntity: {
              id: { required: true, type: () => Number },
              userId: { required: true, type: () => Number },
              updatedAt: { required: true, type: () => Date },
              createdAt: { required: true, type: () => Date },
              user: {
                required: false,
                type: () =>
                  t['./app/features/users/entities/user.entity'].UserEntity,
              },
            },
          },
        ],
        [
          import('./app/features/users/entities/user.entity'),
          {
            UserEntity: {
              id: { required: true, type: () => Number },
              firstName: { required: true, type: () => String },
              lastName: { required: true, type: () => String },
              email: { required: true, type: () => String },
              address: { required: true, type: () => String },
              addressLatitude: {
                required: true,
                type: () => t['@prisma/client/runtime/library'].Decimal,
              },
              addressLongitude: {
                required: true,
                type: () => t['@prisma/client/runtime/library'].Decimal,
              },
              phoneNumber: { required: true, type: () => String },
              role: { required: true, type: () => Object },
              profilePictureKey: { required: true, type: () => String },
              updatedAt: { required: true, type: () => Date },
              createdAt: { required: true, type: () => Date },
              buyer: {
                required: false,
                type: () =>
                  t['./app/features/buyers/entities/buyer.entity'].BuyerEntity,
              },
              deliverer: {
                required: false,
                type: () =>
                  t['./app/features/deliverers/entities/deliverer.entity']
                    .DelivererEntity,
              },
              seller: {
                required: false,
                type: () =>
                  t['./app/features/sellers/entities/seller.entity']
                    .SellerEntity,
              },
            },
          },
        ],
        [
          import('./app/features/users/dto/create-user.dto'),
          {
            CreateUserDto: {
              firstName: { required: true, type: () => String },
              lastName: { required: true, type: () => String },
              email: { required: true, type: () => String },
              password: { required: true, type: () => String },
              address: { required: false, type: () => String },
              addressLatitude: {
                required: false,
                type: () => Number,
                minimum: -90,
                maximum: 90,
              },
              addressLongitude: {
                required: false,
                type: () => Number,
                minimum: -90,
                maximum: 90,
              },
              phoneNumber: { required: false, type: () => String },
            },
          },
        ],
        [
          import('./app/features/users/dto/update-user.dto'),
          { UpdateUserDto: {} },
        ],
        [import('./app/features/auth/dto/login.dto'), { LoginDto: {} }],
        [
          import('./app/features/buyers/dto/create-buyer.dto'),
          { CreateBuyerDto: {} },
        ],
        [
          import('./app/features/buyers/dto/update-buyer.dto'),
          { UpdateBuyerDto: {} },
        ],
        [
          import('./app/features/deliverers/dto/create-deliverer.dto'),
          { CreateDelivererDto: {} },
        ],
        [
          import('./app/features/deliverers/dto/update-deliverer.dto'),
          { UpdateDelivererDto: {} },
        ],
        [
          import('./app/features/sellers/dto/create-seller.dto'),
          { CreateSellerDto: {} },
        ],
        [
          import('./app/features/sellers/dto/update-seller.dto'),
          { UpdateSellerDto: {} },
        ],
        [
          import('./app/features/products/dto/create-product.dto'),
          { CreateProductDto: {} },
        ],
        [
          import('./app/features/products/dto/update-product.dto'),
          { UpdateProductDto: {} },
        ],
        [
          import('./app/common/helpers/entities/pagination-result.entity'),
          { PaginationResultEntity: { result: { required: true } } },
        ],
        [import('./app/features/auth/entities/auth.entity'), { Auth: {} }],
        [
          import('./app/features/products/entities/product.entity'),
          { Product: {} },
        ],
      ],
      controllers: [
        [
          import('./app/features/users/users.controller'),
          {
            UsersController: {
              create: { type: String },
              findAll: { type: String },
              findOne: { type: Object },
              update: { type: String },
              remove: { type: String },
            },
          },
        ],
        [
          import('./app/features/auth/auth.controller'),
          {
            AuthController: {
              login: {},
              me: {
                type: t['./app/features/users/entities/user.entity'].UserEntity,
              },
              logout: {},
            },
          },
        ],
        [
          import('./app/features/buyers/buyers.controller'),
          {
            BuyersController: {
              create: {
                type: t['./app/features/buyers/entities/buyer.entity']
                  .BuyerEntity,
              },
              findAll: {
                type: t['./app/features/buyers/entities/buyer.entity']
                  .BuyerEntity,
              },
              findOne: {
                type: t['./app/features/buyers/entities/buyer.entity']
                  .BuyerEntity,
              },
              update: { type: String },
              remove: { type: String },
            },
          },
        ],
        [
          import('./app/features/deliverers/deliverers.controller'),
          {
            DeliverersController: {
              create: {
                type: t['./app/features/deliverers/entities/deliverer.entity']
                  .DelivererEntity,
              },
              findAll: {
                type: t['./app/features/deliverers/entities/deliverer.entity']
                  .DelivererEntity,
              },
              findOne: {
                type: t['./app/features/deliverers/entities/deliverer.entity']
                  .DelivererEntity,
              },
              update: { type: String },
              remove: { type: String },
            },
          },
        ],
        [
          import('./app/features/sellers/sellers.controller'),
          {
            SellersController: {
              create: {
                type: t['./app/features/sellers/entities/seller.entity']
                  .SellerEntity,
              },
              findAll: {
                type: t['./app/features/sellers/entities/seller.entity']
                  .SellerEntity,
              },
              findOne: {
                type: t['./app/features/sellers/entities/seller.entity']
                  .SellerEntity,
              },
              update: { type: String },
              remove: { type: String },
            },
          },
        ],
        [
          import('./app/features/products/products.controller'),
          {
            ProductsController: {
              create: { type: String },
              findAll: { type: String },
              findOne: { type: String },
              update: { type: String },
              remove: { type: String },
            },
          },
        ],
      ],
    },
  };
};
