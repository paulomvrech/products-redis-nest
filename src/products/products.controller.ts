import {Body, Controller, Delete, Get, HttpCode, Param, Patch, Post} from '@nestjs/common';
import {ProductsService} from "./products.service";

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {
    }

    @Get()
    findAll() {
        return this.productsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Post()
    create(
        @Body() body: { name: string, description?: string, price: number, stock?: number }
    ) {
        return this.productsService.create(body);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() body: { name?: string, description?: string, price?: number, stock?: number }
    ) {
        return this.productsService.update(id, body);
    }

    @Delete(':id')
    @HttpCode(204)
    remove(@Param('id') id: string) {
        return this.productsService.remove(id)
    }
}
