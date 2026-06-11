import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {Prisma, Product} from '../generated/prisma/client';

@Injectable()
export class ProductsRepository {
    constructor(private readonly prisma: PrismaService) {
    }

    findById(id: string): Promise<Product | null> {
        return this.prisma.product.findUnique({where: {id}});
    }

    findAll(): Promise<Product[]> {
        return this.prisma.product.findMany()
    }

    create(data: Prisma.ProductCreateInput): Promise<Product> {
        return this.prisma.product.create({data})
    }

    update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
        return this.prisma.product.update({where: {id}, data: data})
    }

    delete(id: string): Promise<Product> {
        return this.prisma.product.delete({where: {id}});
    }
}