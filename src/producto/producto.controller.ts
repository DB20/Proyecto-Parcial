/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ProductoEntity } from './producto.entity';
import { ProductoDto } from './producto.dto';

@Controller('producto')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
    constructor(private readonly productoService: ProductoService){}

    @Get()
    async findAll(){
        return await this.productoService.findAll();
    }

    @Get(':productId')
    async findOne(@Param('productId') productId: string){
        return await this.productoService.findOne(productId)
    }

    @Post()
    async create(@Body() productoDto: ProductoDto) {
        const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
        return await this.productoService.create(producto);
    }

    @Put(':productoId')
    async update(@Param('productoId') productoId: string, @Body() productoDto: ProductoDto) {
        const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
        return await this.productoService.update(productoId, producto);
    }

    @Delete(':productoId')
    @HttpCode(204)
    async delete(@Param('productoId') productoId: string) {
        return await this.productoService.delete(productoId);
    }
}
