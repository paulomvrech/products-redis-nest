import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {ProductsRepository} from "./products.repository";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import * as cacheManager from 'cache-manager';
import {Product} from "../generated/prisma/client";

@Injectable()
export class ProductsService {
    constructor(
        private readonly repository: ProductsRepository,
        @Inject(CACHE_MANAGER) private readonly cache: cacheManager.Cache
    ) {
    }

    async findOne(id: string): Promise<Product> {
        const cacheKey = `product:${id}`;
        const init = performance.now();

        const cached = await this.cache.get<Product>(cacheKey);
        if (cached) {
            const time = (performance.now() - init).toFixed(1);
            console.log(`🎯 [CACHE HIT]  ${id} → ${time}ms (direto do Redis)`);
            return cached;
        }

        const product = await this.repository.findById(id);
        if (!product) {
            throw new NotFoundException(`Produto ${id} nao encontrado`);
        }

        await this.cache.set(cacheKey, product, 60_000);
        const time = (performance.now() - init).toFixed(1);
        console.log(`❌ [CACHE MISS] ${id} → ${time}ms (buscou no PostgreSQL)`);
        return product;
    }

    findAll(): Promise<Product[]> {
        return this.repository.findAll();
    }

    create(data: {
        name: string;
        description?: string;
        price: number;
        stock?: number;
    }): Promise<Product> {
        return this.repository.create(data);
    }

    async update(
        id: string,
        data: { name?: string, description?: string, price?: number, stock?: number }
    ): Promise<Product> {
        const updated = await this.repository.update(id, data);
        await this.cache.del(`product:${id}`); // invalida
        console.log(`🗑 [CACHE INVALIDATE ${id}`);
        return updated;
    }

    async remove(id: string): Promise<void> {
        await this.repository.delete(id);
        await this.cache.del(`product:${id}`);
    }
}
