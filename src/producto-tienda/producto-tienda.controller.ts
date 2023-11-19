/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ProductoTiendaService } from './producto-tienda.service';
import { TiendaDto } from 'src/tienda/tienda.dto';
import { TiendaEntity } from 'src/tienda/tienda.entity';
import { plainToInstance } from 'class-transformer';

@Controller('producto-tienda')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoTiendaController {
    constructor(private readonly productoTiendaService: ProductoTiendaService){}

    @Post('products/:productoId/stores/:tiendaId')
    async addStoreToProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
        return await this.productoTiendaService.addStoreToProduct(productoId, tiendaId);
    }

   @Get('products/:productoId/stores/:tiendaId')
   async findStoreFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
       return await this.productoTiendaService.findStoreFromProduct(productoId, tiendaId);
   }
   @Get('products/:productoId/stores')
   async findStoresFromProduct(@Param('productoId') productoId: string){
       return await this.productoTiendaService.findStoresFromProduct(productoId);
   }

   @Put('producto/:productoId/stores')
   async updateStoresFromProduct(@Body() tiendasDto: TiendaDto[], @Param('productoId') productoId: string){
       const tienda = plainToInstance(TiendaEntity, tiendasDto)
       return await this.productoTiendaService.updateStoresFromProduct(productoId, tienda);
   }

   @Delete('products/:productoId/stores/:tiendaId')
@HttpCode(204)
   async deleteStoreFromProduct(@Param('productoId') productoId: string, @Param('tiendaId') tiendaId: string){
       return await this.productoTiendaService.deleteStoreFromProduct(productoId, tiendaId);
   }
}
