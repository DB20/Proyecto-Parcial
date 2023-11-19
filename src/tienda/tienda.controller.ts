/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors} from '@nestjs/common';
import { TiendaService } from './tienda.service';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { TiendaEntity } from './tienda.entity';
import { TiendaDto } from './tienda.dto';


@Controller('tienda')
@UseInterceptors(BusinessErrorsInterceptor)
export class TiendaController {
    constructor(private readonly tiendaService: TiendaService){}

    @Get()
    async findAll(){
        return await this.tiendaService.findAll();
    }

    @Get(':tiendaId')
    async findOne(@Param('tiendaId') tiendaId: string){
        return await this.tiendaService.findOne(tiendaId)
    }

    @Post()
    async create(@Body() tiendaDTO: TiendaDto) {
        const producto: TiendaEntity = plainToInstance(TiendaEntity, tiendaDTO);
        return await this.tiendaService.create(producto);
    }

    @Put(':tiendaId')
    async update(@Param('tiendaId') tiendaId: string, @Body() tiendaDTO: TiendaDto) {
        const producto: TiendaEntity = plainToInstance(TiendaEntity, tiendaDTO);
        return await this.tiendaService.update(tiendaId, producto);
    }

    @Delete(':tiendaId')
    @HttpCode(204)
    async delete(@Param('tiendaId') tiendaId: string) {
        return await this.tiendaService.delete(tiendaId);
    }
}
