import { JWTPayloadUser } from '../authentication/jwt';
import { extendedPrismaClient } from './prisma.extension';
import { ProductEntity } from '../../features/products/entities';
import { ShopEntity } from '../../features/shops/entities';

export type WithIsFavored<T> = T & {
  isFavored?: boolean;
};

export async function computeIsFavoredProduct<T extends ProductEntity>(
  user: JWTPayloadUser,
  product: T,
): Promise<WithIsFavored<T>> {
  const res = await extendedPrismaClient.favoriteProduct.findFirst({
    where: { customerId: user.customer?.id, productId: product.id },
  });

  return {
    ...product,
    shop: product.shop
      ? await computeIsFavoredShop(user, product.shop)
      : product.shop,
    isFavored: res ? true : false,
  };
}

export async function computeIsFavoredProducts<T extends ProductEntity>(
  user: JWTPayloadUser,
  products: T[],
): Promise<WithIsFavored<T>[]> {
  const favProducts = await extendedPrismaClient.product.groupBy({
    by: ['id'],
    where: {
      id: { in: products.map((prod) => prod.id) },
      favoriteProducts: { some: { customerId: user.customer?.id } },
    },
  });

  const productIds = favProducts.map((prod) => prod.id);
  for await (const prod of products) {
    prod.isFavored = productIds.includes(prod.id);
    prod.shop = prod.shop
      ? await computeIsFavoredShop(user, prod.shop)
      : prod.shop;
  }
  return products;
}

export async function computeIsFavoredShop<T extends ShopEntity>(
  user: JWTPayloadUser,
  shop: T,
): Promise<WithIsFavored<T>> {
  const res = await extendedPrismaClient.favoriteShop.findFirst({
    where: { customerId: user.customer?.id, shopId: shop.id },
  });

  return {
    ...shop,
    products: shop.products
      ? await computeIsFavoredProducts(user, shop.products)
      : shop.products,
    isFavored: res ? true : false,
  };
}

export async function computeIsFavoredShops<T extends ShopEntity>(
  user: JWTPayloadUser,
  shops: T[],
): Promise<WithIsFavored<T>[]> {
  const favShops = await extendedPrismaClient.shop.groupBy({
    by: ['id'],
    where: {
      id: { in: shops.map((prod) => prod.id) },
      favoriteShops: { some: { customerId: user.customer?.id } },
    },
  });

  const shopIds = favShops.map((shop) => shop.id);

  for await (const shop of shops) {
    shop.isFavored = shopIds.includes(shop.id);
    shop.products = shop.products
      ? await computeIsFavoredProducts(user, shop.products)
      : shop.products;
  }
  return shops;
}
