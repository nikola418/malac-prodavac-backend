import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'nestjs-prisma';
import { Customer, Prisma, UserRole } from '@prisma/client';
import { hashPassword } from '../../../util/helper';
import { createPaginator } from 'prisma-pagination';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  static readonly include: Prisma.CustomerInclude = {
    user: true,
  };

  static readonly queryWhere: Prisma.CustomerWhereInput = {
    user: { roles: { has: UserRole.Customer } },
  };

  create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        user: {
          create: {
            ...createCustomerDto.user,
            password: hashPassword(createCustomerDto.user.password),
          },
        },
      },
      include: CustomersService.include,
    });
  }

  async findAll(findOptions: Prisma.CustomerFindManyArgs) {
    const paginator = createPaginator({ perPage: findOptions.take });
    const page = findOptions.skip;

    return paginator<Customer, Prisma.CustomerFindManyArgs>(
      this.prisma.customer,
      {
        ...findOptions,
        include: CustomersService.include,
      },
      { page },
    );
  }

  findOne(
    where: Prisma.CustomerWhereUniqueInput,
    include?: Prisma.CustomerInclude,
  ) {
    return this.prisma.customer.findUniqueOrThrow({
      where,
      include: include ?? CustomersService.include,
    });
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data: {
        user: {
          update: {
            ...updateCustomerDto.user,
            password:
              updateCustomerDto.user?.password &&
              hashPassword(updateCustomerDto.user.password),
          },
        },
      },
      include: CustomersService.include,
    });
  }
}