/* eslint-disable */
export default async () => {
    const t = {
        ["./util/enum/environment.enum"]: await import("./util/enum/environment.enum"),
        ["./app/features/users/entities/user.entity"]: await import("./app/features/users/entities/user.entity"),
        ["@prisma/client/runtime/library"]: await import("@prisma/client/runtime/library"),
        ["@chax-at/prisma-filter-common/lib/filter.enum"]: await import("@chax-at/prisma-filter-common/lib/filter.enum"),
        ["./app/features/products/entities/product.entity"]: await import("./app/features/products/entities/product.entity"),
        ["./app/features/customers/entities/customer.entity"]: await import("./app/features/customers/entities/customer.entity"),
        ["./app/features/couriers/entities/courier.entity"]: await import("./app/features/couriers/entities/courier.entity"),
        ["./app/features/customers/entities/favorite-shop.entity"]: await import("./app/features/customers/entities/favorite-shop.entity"),
        ["./app/features/products/entities/product-review-reply.entity"]: await import("./app/features/products/entities/product-review-reply.entity"),
        ["./app/features/shops/entities/shop.entity"]: await import("./app/features/shops/entities/shop.entity"),
        ["./app/features/categories/entities/category.entity"]: await import("./app/features/categories/entities/category.entity"),
        ["./app/features/products/entities/product-review.entity"]: await import("./app/features/products/entities/product-review.entity"),
        ["./app/features/customers/entities/favorite-product.entity"]: await import("./app/features/customers/entities/favorite-product.entity"),
        ["./app/features/products/entities/product-media.entity"]: await import("./app/features/products/entities/product-media.entity"),
        ["./app/features/users/dto/create-user.dto"]: await import("./app/features/users/dto/create-user.dto"),
        ["./app/features/users/dto/update-user.dto"]: await import("./app/features/users/dto/update-user.dto"),
        ["./app/features/notifications/entities/notification-payload.entity"]: await import("./app/features/notifications/entities/notification-payload.entity"),
        ["./app/features/users/entities/user-media.entity"]: await import("./app/features/users/entities/user-media.entity"),
        ["./app/features/orders/entities/scheduled-pickup.entity"]: await import("./app/features/orders/entities/scheduled-pickup.entity"),
        ["./app/features/orders/entities/order.entity"]: await import("./app/features/orders/entities/order.entity"),
        ["./app/features/customers/entities/customer-review.entity"]: await import("./app/features/customers/entities/customer-review.entity"),
        ["./app/features/chats/entities/chat.entity"]: await import("./app/features/chats/entities/chat.entity"),
        ["./app/features/notifications/entities/notification.entity"]: await import("./app/features/notifications/entities/notification.entity")
    };
    return { "@nestjs/swagger": { "models": [[import("./app/core/configuration/app/app-config.dto"), { "AppConfigDto": { NODE_ENV: { required: true, enum: t["./util/enum/environment.enum"].Environment }, PROTOCOL: { required: true, type: () => String }, BASE_DOMAIN: { required: true, type: () => String }, API_PORT: { required: true, type: () => Number, minimum: 1, maximum: 65535 }, APK_SECRET: { required: true, type: () => String }, MAX_FILESIZE_B: { required: true, type: () => Number, minimum: 1 }, MULTER_DEST: { required: true, type: () => String }, USER_MEDIA_DEST: { required: true, type: () => String }, PRODUCT_MEDIA_DEST: { required: true, type: () => String }, APK_DEST: { required: true, type: () => String }, SECRET_KEY: { required: true, type: () => String, minLength: 32 }, SALT_ROUNDS: { required: false, type: () => Number, minimum: 10 }, COOKIE_NAME: { required: true, type: () => String }, EXPIRES_IN: { required: true, type: () => String }, THROTTLER_TTL: { required: true, type: () => Number, minimum: 1 }, THROTTLER_LIMIT: { required: true, type: () => Number, minimum: 0 } } }], [import("./app/core/configuration/prisma/prisma-config.dto"), { "PrismaConfigDto": { PRISMA_LOGS: { required: true, type: () => Object }, POSTGRES_DATABASE_URL: { required: true, type: () => String }, PRISMA_EXPLICIT_CONN: { required: true, type: () => Boolean } } }], [import("./app/features/customers/entities/customer.entity"), { "CustomerEntity": { id: { required: true, type: () => Number }, userId: { required: true, type: () => Number }, rating: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, ratingsCount: { required: true, type: () => Number }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, user: { required: false, type: () => t["./app/features/users/entities/user.entity"].UserEntity } } }], [import("./app/features/couriers/entities/courier.entity"), { "CourierEntity": { id: { required: true, type: () => Number }, userId: { required: true, type: () => Number }, routeStartLatitude: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, routeStartLongitude: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, routeEndLatitude: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, routeEndLongitude: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, rating: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, ratingsCount: { required: true, type: () => Number }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, user: { required: false, type: () => t["./app/features/users/entities/user.entity"].UserEntity } } }], [import("./app/core/prisma/dto/single-filter-order.dto"), { "SingleFilterOrder": { field: { required: true, type: () => Object }, dir: { required: true, type: () => Object } } }], [import("./app/core/prisma/dto/single-filter.dto"), { "SingleFilter": { field: { required: true, type: () => Object }, type: { required: true, enum: t["@chax-at/prisma-filter-common/lib/filter.enum"].FilterOperationType }, value: { required: true, type: () => Object } } }], [import("./app/core/prisma/dto/filter.dto"), { "Filter": { filter: { required: false }, order: { required: false }, offset: { required: false, type: () => Number, minimum: 0 }, limit: { required: true, type: () => Number, default: 20, minimum: 1, maximum: 100 } }, "FilterDto": { findOptions: { required: true, type: () => Object } } }], [import("./app/features/orders/entities/order.entity"), { "OrderEntity": { id: { required: true, type: () => Number }, productId: { required: true, type: () => Number }, customerId: { required: true, type: () => Number }, courierId: { required: true, type: () => Number }, quantity: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, accepted: { required: true, type: () => Boolean }, paymentMethod: { required: true, type: () => Object }, orderStatus: { required: true, type: () => Object }, deliveryMethod: { required: true, type: () => Object }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, product: { required: false, type: () => t["./app/features/products/entities/product.entity"].ProductEntity }, customer: { required: false, type: () => t["./app/features/customers/entities/customer.entity"].CustomerEntity }, courier: { required: false, type: () => t["./app/features/couriers/entities/courier.entity"].CourierEntity } } }], [import("./app/features/orders/entities/scheduled-pickup.entity"), { "ScheduledPickupEntity": { id: { required: true, type: () => Number }, orderId: { required: true, type: () => Number }, timeOfDay: { required: true, type: () => String }, date: { required: true, type: () => String }, accepted: { required: true, type: () => Boolean }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date } } }], [import("./app/features/shops/entities/shop.entity"), { "ShopEntity": { isFavored: { required: false, type: () => Boolean }, id: { required: true, type: () => Number }, userId: { required: true, type: () => Number }, businessName: { required: true, type: () => String }, openFrom: { required: true, type: () => String }, openTill: { required: true, type: () => String }, openFromDays: { required: true, type: () => Object }, openTillDays: { required: true, type: () => Object }, availableAt: { required: true, type: () => String }, availableAtLatitude: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, availableAtLongitude: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, user: { required: false, type: () => t["./app/features/users/entities/user.entity"].UserEntity }, products: { required: false, type: () => [t["./app/features/products/entities/product.entity"].ProductEntity] }, favoriteShops: { required: false, type: () => [t["./app/features/customers/entities/favorite-shop.entity"].FavoriteShopEntity] } } }], [import("./app/features/categories/entities/category.entity"), { "CategoryEntity": { id: { required: true, type: () => Number }, name: { required: true, type: () => String }, parentCategoryId: { required: true, type: () => Number }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date } } }], [import("./app/features/products/entities/product-review-reply.entity"), { "ProductReviewReplyEntity": { id: { required: true, type: () => Number }, text: { required: true, type: () => String }, reviewId: { required: true, type: () => Number }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date } } }], [import("./app/features/products/entities/product-review.entity"), { "ProductReviewEntity": { id: { required: true, type: () => Number }, customerId: { required: true, type: () => Number }, productId: { required: true, type: () => Number }, text: { required: true, type: () => String }, rating: { required: true, type: () => Number }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, reviewReplies: { required: false, type: () => [t["./app/features/products/entities/product-review-reply.entity"].ProductReviewReplyEntity] }, customer: { required: false, type: () => t["./app/features/customers/entities/customer.entity"].CustomerEntity } } }], [import("./app/features/products/entities/product-media.entity"), { "ProductMediaEntity": { id: { required: true, type: () => Number }, mimetype: { required: true, type: () => String }, key: { required: true, type: () => String }, productId: { required: true, type: () => Number }, originalName: { required: true, type: () => String }, name: { required: true, type: () => String }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date } } }], [import("./app/features/products/entities/product.entity"), { "ProductEntity": { isFavored: { required: false, type: () => Boolean }, id: { required: true, type: () => Number }, shopId: { required: true, type: () => Number }, title: { required: true, type: () => String }, desc: { required: true, type: () => String }, price: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, available: { required: true, type: () => Boolean }, unitOfMeasurement: { required: true, type: () => Object }, rating: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, ratingsCount: { required: true, type: () => Number }, availableAt: { required: true, type: () => String }, availableAtLatitude: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, availableAtLongitude: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, availableFromHours: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, availableTillHours: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, categoryId: { required: true, type: () => Number }, currency: { required: true, type: () => String }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, shop: { required: false, type: () => t["./app/features/shops/entities/shop.entity"].ShopEntity }, category: { required: false, type: () => t["./app/features/categories/entities/category.entity"].CategoryEntity }, reviews: { required: false, type: () => [t["./app/features/products/entities/product-review.entity"].ProductReviewEntity] }, favoriteProducts: { required: false, type: () => [t["./app/features/customers/entities/favorite-product.entity"].FavoriteProductEntity] }, productMedia: { required: false, type: () => t["./app/features/products/entities/product-media.entity"].ProductMediaEntity } } }], [import("./app/features/customers/entities/favorite-product.entity"), { "FavoriteProductEntity": { id: { required: true, type: () => Number }, customerId: { required: true, type: () => Number }, productId: { required: true, type: () => Number }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, product: { required: false, type: () => t["./app/features/products/entities/product.entity"].ProductEntity } } }], [import("./app/features/customers/entities/favorite-shop.entity"), { "FavoriteShopEntity": { id: { required: true, type: () => Number }, customerId: { required: true, type: () => Number }, shopId: { required: true, type: () => Number }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, shop: { required: false, type: () => t["./app/features/shops/entities/shop.entity"].ShopEntity } } }], [import("./app/features/customers/entities/customer-review.entity"), { "CustomerReviewEntity": { customerId: { required: true, type: () => Number }, shopId: { required: true, type: () => Number }, text: { required: true, type: () => String }, rating: { required: true, type: () => Number }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, customer: { required: false, type: () => t["./app/features/customers/entities/customer.entity"].CustomerEntity }, shop: { required: false, type: () => t["./app/features/shops/entities/shop.entity"].ShopEntity } } }], [import("./app/features/users/entities/user.entity"), { "UserEntity": { id: { required: true, type: () => Number }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, email: { required: true, type: () => String }, address: { required: true, type: () => String }, addressLatitude: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, addressLongitude: { required: true, type: () => t["@prisma/client/runtime/library"].Decimal }, phoneNumber: { required: true, type: () => String }, roles: { required: true, type: () => [Object] }, paymentMethod: { required: true, type: () => Object }, currency: { required: true, type: () => String }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, customer: { required: false, type: () => t["./app/features/customers/entities/customer.entity"].CustomerEntity }, courier: { required: false, type: () => t["./app/features/couriers/entities/courier.entity"].CourierEntity }, shop: { required: false, type: () => t["./app/features/shops/entities/shop.entity"].ShopEntity } } }], [import("./app/features/users/entities/user-media.entity"), { "UserMediaEntity": { id: { required: true, type: () => Number }, userId: { required: true, type: () => Number }, mimetype: { required: true, type: () => String }, key: { required: true, type: () => String }, originalName: { required: true, type: () => String }, name: { required: true, type: () => String }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date } } }], [import("./app/features/users/dto/create-user.dto"), { "CreateUserDto": { firstName: { required: true, type: () => String, pattern: "nameRegex" }, lastName: { required: true, type: () => String, pattern: "nameRegex" }, email: { required: true, type: () => String }, password: { required: true, type: () => String, pattern: "passwordRegex" }, address: { required: false, type: () => String }, addressLatitude: { required: false, type: () => Number, minimum: -90, maximum: 90 }, addressLongitude: { required: false, type: () => Number, minimum: -90, maximum: 90 }, currency: { required: false, type: () => String }, paymentMethod: { required: false, type: () => Object }, phoneNumber: { required: false, type: () => String, pattern: "phoneRegex" } } }], [import("./app/features/users/dto/update-user.dto"), { "UpdateUserDto": { profilePictureKey: { required: false, type: () => String } } }], [import("./app/features/auth/dto/login.dto"), { "LoginDto": {} }], [import("./app/features/customers/dto/create-customer.dto"), { "CreateCustomerDto": { user: { required: true, type: () => t["./app/features/users/dto/create-user.dto"].CreateUserDto } } }], [import("./app/features/customers/dto/update-customer.dto"), { "UpdateCustomerDto": { user: { required: false, type: () => t["./app/features/users/dto/update-user.dto"].UpdateUserDto } } }], [import("./app/features/customers/dto/create-favorite-product.dto"), { "CreateFavoriteProductDto": { productId: { required: true, type: () => Number, minimum: 1 } } }], [import("./app/features/customers/dto/create-favorite-shop.dto"), { "CreateFavoriteShopDto": { shopId: { required: true, type: () => Number, minimum: 1 } } }], [import("./app/features/products/dto/create-product.dto"), { "CreateProductDto": { title: { required: true, type: () => String }, desc: { required: false, type: () => String }, price: { required: true, type: () => Number, minimum: 1 }, categoryId: { required: true, type: () => Number }, unitOfMeasurement: { required: true, type: () => Object }, availableAt: { required: false, type: () => String }, availableAtLatitude: { required: false, type: () => Number, minimum: 1 }, availableAtLongitude: { required: false, type: () => Number, minimum: 1 }, availableFromHours: { required: false, type: () => Number, minimum: 1 }, availableTillHours: { required: false, type: () => Number, minimum: 1 }, currency: { required: false, type: () => String } } }], [import("./app/features/products/dto/update-product.dto"), { "UpdateProductDto": { available: { required: true, type: () => Boolean } } }], [import("./app/features/products/dto/create-product-review.dto"), { "CreateProductReviewDto": { text: { required: false, type: () => String }, rating: { required: false, type: () => Number, maximum: 5, minimum: 1 } } }], [import("./app/features/products/dto/create-product-review-reply.dto"), { "CreateProductReviewReplyDto": { text: { required: true, type: () => String } } }], [import("./app/features/products/dto/update-product-review.dto"), { "UpdateProductReviewDto": {} }], [import("./app/features/shops/dto/create-shop.dto"), { "CreateShopDto": { user: { required: true, type: () => t["./app/features/users/dto/create-user.dto"].CreateUserDto }, businessName: { required: false, type: () => String } } }], [import("./app/features/shops/dto/update-shop.dto"), { "UpdateShopDto": { user: { required: false, type: () => t["./app/features/users/dto/update-user.dto"].UpdateUserDto }, businessName: { required: false, type: () => String }, openFrom: { required: true, type: () => String, pattern: "timeOfDayRegex" }, openTill: { required: true, type: () => String, pattern: "timeOfDayRegex" }, openFromDays: { required: true, type: () => Object }, openTillDays: { required: true, type: () => Object }, availableAt: { required: true, type: () => String }, availableAtLatitude: { required: true, type: () => Number, minimum: -90, maximum: 90 }, availableAtLongitude: { required: true, type: () => Number, minimum: -90, maximum: 90 } } }], [import("./app/features/orders/dto/create-order.dto"), { "CreateOrderDto": { productId: { required: true, type: () => Number }, deliveryMethod: { required: true, type: () => Object }, paymentMethod: { required: true, type: () => Object }, quantity: { required: true, type: () => Number, minimum: 1 } } }], [import("./app/features/orders/dto/update-order.dto"), { "UpdateOrderDto": { orderStatus: { required: true, type: () => Object }, accepted: { required: false, type: () => Boolean }, courierId: { required: true, type: () => Number, minimum: 1 } } }], [import("./app/features/orders/dto/create-scheduled-pickup.dto"), { "CreateScheduledPickupDto": { timeOfDay: { required: true, type: () => String }, date: { required: true, type: () => String } } }], [import("./app/features/orders/dto/update-scheduled-pickup.dto"), { "UpdateScheduledPickupDto": { accepted: { required: true, type: () => Boolean } } }], [import("./app/features/customers/dto/create-customer-review.dto"), { "CreateCustomerReviewDto": { text: { required: true, type: () => String }, rating: { required: true, type: () => Number, maximum: 5, minimum: 1 } } }], [import("./app/features/couriers/dto/create-courier.dto"), { "CreateCourierDto": { user: { required: true, type: () => t["./app/features/users/dto/create-user.dto"].CreateUserDto } } }], [import("./app/features/couriers/dto/update-courier.dto"), { "UpdateCourierDto": { user: { required: false, type: () => t["./app/features/users/dto/update-user.dto"].UpdateUserDto }, routeStartLatitude: { required: true, type: () => Number, minimum: -90, maximum: 90 }, routeStartLongitude: { required: true, type: () => Number, minimum: -90, maximum: 90 }, routeEndLatitude: { required: true, type: () => Number, minimum: -90, maximum: 90 }, routeEndLongitude: { required: true, type: () => Number, minimum: -90, maximum: 90 } } }], [import("./app/features/chats/dto/create-chat-message.dto"), { "CreateChatMessageDto": { toUserId: { required: true, type: () => Number, minimum: 1 } } }], [import("./app/features/chats/dto/open-chat.dto"), { "OpenChatDto": { chatId: { required: true, type: () => Number, minimum: 1 } } }], [import("./app/features/chats/entities/chat.entity"), { "ChatEntity": { id: { required: true, type: () => Number }, customerId: { required: true, type: () => Number }, shopId: { required: true, type: () => Number }, visibilityCustomer: { required: true, type: () => Boolean }, visibilityShop: { required: true, type: () => Boolean }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date } } }], [import("./app/features/chats/entities/chat-message.entity"), { "ChatMessageEntity": { id: { required: true, type: () => Number }, chatId: { required: true, type: () => Number }, text: { required: true, type: () => String }, recipientUserId: { required: true, type: () => Number }, opened: { required: true, type: () => Boolean }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date } } }], [import("./app/features/notifications/entities/notification-payload.entity"), { "NotificationPayloadEntity": { id: { required: true, type: () => Number }, payload: { required: true, type: () => Object }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date } } }], [import("./app/features/notifications/entities/notification.entity"), { "NotificationEntity": { id: { required: true, type: () => Number }, userId: { required: true, type: () => Number }, notificationPayloadId: { required: true, type: () => Number }, updatedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, notificationPayload: { required: false, type: () => t["./app/features/notifications/entities/notification-payload.entity"].NotificationPayloadEntity } } }], [import("./app/features/auth/entities/auth.entity"), { "Auth": {} }], [import("./app/features/notifications/dto/create-notification.dto"), { "CreateNotificationDto": {} }], [import("./app/features/notifications/dto/update-notification.dto"), { "UpdateNotificationDto": {} }]], "controllers": [[import("./app/features/users/controllers/users.controller"), { "UsersController": { "findAll": {}, "findOne": { type: t["./app/features/users/entities/user.entity"].UserEntity }, "remove": { type: t["./app/features/users/entities/user.entity"].UserEntity } } }], [import("./app/features/users/controllers/user-medias.controller"), { "UserMediasController": { "upsert": { type: t["./app/features/users/entities/user-media.entity"].UserMediaEntity }, "findAll": {}, "findOne": {}, "remove": { type: t["./app/features/users/entities/user-media.entity"].UserMediaEntity } } }], [import("./app/features/auth/auth.controller"), { "AuthController": { "login": { type: t["./app/features/users/entities/user.entity"].UserEntity }, "me": { type: t["./app/features/users/entities/user.entity"].UserEntity }, "logout": {} } }], [import("./app/features/customers/controllers/customers.controller"), { "CustomersController": { "create": { type: t["./app/features/customers/entities/customer.entity"].CustomerEntity }, "findAll": {}, "findOne": { type: t["./app/features/customers/entities/customer.entity"].CustomerEntity }, "update": { type: t["./app/features/customers/entities/customer.entity"].CustomerEntity } } }], [import("./app/features/customers/controllers/favorite-products.controller"), { "FavoriteProductsController": { "create": { type: t["./app/features/customers/entities/favorite-product.entity"].FavoriteProductEntity }, "findAll": {}, "remove": { type: t["./app/features/customers/entities/favorite-product.entity"].FavoriteProductEntity } } }], [import("./app/features/customers/controllers/favorite-shops.controller"), { "FavoriteShopsController": { "create": { type: t["./app/features/customers/entities/favorite-shop.entity"].FavoriteShopEntity }, "findAll": {}, "remove": { type: t["./app/features/customers/entities/favorite-shop.entity"].FavoriteShopEntity } } }], [import("./app/features/customers/controllers/scheduled-pickups.controller"), { "ScheduledPickupsController": { "findAll": {}, "findOne": { type: t["./app/features/orders/entities/scheduled-pickup.entity"].ScheduledPickupEntity } } }], [import("./app/features/customers/controllers/customer-orders.controller"), { "CustomerOrdersController": { "findAll": {}, "findOne": { type: t["./app/features/orders/entities/order.entity"].OrderEntity } } }], [import("./app/features/customers/controllers/customer-reviews.controller"), { "CustomerReviewsController": { "create": { type: t["./app/features/customers/entities/customer-review.entity"].CustomerReviewEntity }, "findAll": {}, "findOne": { type: t["./app/features/customers/entities/customer-review.entity"].CustomerReviewEntity } } }], [import("./app/features/orders/controllers/orders.controller"), { "OrdersController": { "create": { type: t["./app/features/orders/entities/order.entity"].OrderEntity }, "findAll": {}, "findOne": { type: t["./app/features/orders/entities/order.entity"].OrderEntity }, "update": { type: t["./app/features/orders/entities/order.entity"].OrderEntity }, "remove": { type: t["./app/features/orders/entities/order.entity"].OrderEntity } } }], [import("./app/features/orders/controllers/scheduled-pickups.controller"), { "ScheduledPickupsController": { "create": { type: t["./app/features/orders/entities/scheduled-pickup.entity"].ScheduledPickupEntity }, "update": { type: t["./app/features/orders/entities/scheduled-pickup.entity"].ScheduledPickupEntity } } }], [import("./app/features/products/controllers/product-medias.controller"), { "ProductMediasController": { "create": { type: t["./app/features/products/entities/product-media.entity"].ProductMediaEntity }, "findAll": {}, "findOne": {}, "remove": { type: t["./app/features/products/entities/product-media.entity"].ProductMediaEntity } } }], [import("./app/features/products/controllers/products.controller"), { "ProductsController": { "create": { type: t["./app/features/products/entities/product.entity"].ProductEntity }, "findAll": {}, "findOne": { type: t["./app/features/products/entities/product.entity"].ProductEntity }, "update": { type: t["./app/features/products/entities/product.entity"].ProductEntity }, "remove": { type: t["./app/features/products/entities/product.entity"].ProductEntity } } }], [import("./app/features/products/controllers/product-reviews.controller"), { "ProductReviewsController": { "create": { type: t["./app/features/products/entities/product-review.entity"].ProductReviewEntity }, "findAll": {}, "findOne": { type: t["./app/features/products/entities/product-review.entity"].ProductReviewEntity }, "update": { type: t["./app/features/products/entities/product-review.entity"].ProductReviewEntity } } }], [import("./app/features/products/controllers/product-review-replies.controller"), { "ProductReviewRepliesController": { "create": { type: t["./app/features/products/entities/product-review-reply.entity"].ProductReviewReplyEntity }, "findAll": {}, "findOne": { type: t["./app/features/products/entities/product-review-reply.entity"].ProductReviewReplyEntity } } }], [import("./app/features/couriers/controllers/courier-orders.controller"), { "CourierOrdersController": { "findAll": {}, "findOne": { type: t["./app/features/orders/entities/order.entity"].OrderEntity } } }], [import("./app/features/couriers/controllers/couriers.controller"), { "CouriersController": { "create": { type: t["./app/features/couriers/entities/courier.entity"].CourierEntity }, "findAll": {}, "findOne": { type: t["./app/features/couriers/entities/courier.entity"].CourierEntity }, "update": { type: t["./app/features/couriers/entities/courier.entity"].CourierEntity } } }], [import("./app/features/shops/controllers/shops.controller"), { "ShopsController": { "create": { type: t["./app/features/shops/entities/shop.entity"].ShopEntity }, "findAll": {}, "findOne": { type: t["./app/features/shops/entities/shop.entity"].ShopEntity }, "update": { type: t["./app/features/shops/entities/shop.entity"].ShopEntity } } }], [import("./app/features/shops/controllers/scheduled-pickups.controller"), { "ScheduledPickupsController": { "findAll": {}, "findOne": { type: t["./app/features/orders/entities/scheduled-pickup.entity"].ScheduledPickupEntity } } }], [import("./app/features/shops/controllers/shop-orders.controller"), { "ShopOrdersController": { "findAll": {}, "findOne": { type: t["./app/features/orders/entities/order.entity"].OrderEntity } } }], [import("./app/features/categories/categories.controller"), { "CategoriesController": { "findAll": {}, "findOne": { type: t["./app/features/categories/entities/category.entity"].CategoryEntity } } }], [import("./app/features/chats/controllers/chat-messages.controller"), { "ChatMessagesController": { "findAll": {}, "findOne": { type: t["./app/features/chats/entities/chat.entity"].ChatEntity } } }], [import("./app/features/chats/controllers/chats.controller"), { "ChatsController": { "findAll": {}, "findOne": { type: t["./app/features/chats/entities/chat.entity"].ChatEntity } } }], [import("./app/features/notifications/notifications.controller"), { "NotificationsController": { "subscribe": { type: Object }, "findAll": {}, "findOne": { type: t["./app/features/notifications/entities/notification.entity"].NotificationEntity } } }], [import("./app/features/apk/apk.controller"), { "ApkController": { "upsert": {}, "findOne": {} } }]] } };
};