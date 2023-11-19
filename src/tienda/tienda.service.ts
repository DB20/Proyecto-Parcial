/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { TiendaEntity } from './tienda.entity';

@Injectable()
export class TiendaService {
    constructor(
        @InjectRepository(TiendaEntity)
        private readonly tiendaRepository: Repository<TiendaEntity>
    ){}

    async findAll(): Promise<TiendaEntity[]> {
        return await this.tiendaRepository.find({ relations: ["productos"]});
    }

    async findOne(id: string): Promise<TiendaEntity> {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}, relations: ["productos"]});
        if (!tienda)
            throw new BusinessLogicException("La tienda con el id no fue encontrada", BusinessError.NOT_FOUND);

        return tienda;
    }

    async create(tienda: TiendaEntity): Promise<TiendaEntity> {
        this.validateCity(tienda.city);
        return await this.tiendaRepository.save(tienda);
    }

    async update(id: string, tienda: TiendaEntity): Promise<TiendaEntity> {
        const tiendabase: TiendaEntity = await this.tiendaRepository.findOne({where: {id}});
        this.validateCity(tienda.city);

        if (!tiendabase)
            throw new BusinessLogicException("La tienda con el id no  fue encontrada", BusinessError.NOT_FOUND);
        return await this.tiendaRepository.save({...tiendabase, ...tienda})
    }

    async delete(id: string) {
        const tienda: TiendaEntity = await this.tiendaRepository.findOne({where: {id}});
        if (!tienda)
            throw new BusinessLogicException("La tienda con el id no fue encontrada", BusinessError.NOT_FOUND);
        await this.tiendaRepository.remove(tienda);
    }
    private validateCity(city: string): void {
        // Add your validation logic here
        const cityRegex = /^[A-Z]{3}$/;

        if (!cityRegex.test(city)) {
            throw new BusinessLogicException("La ciudad debe de seguir código de 3 letras", BusinessError.PRECONDITION_FAILED);
        }
    }
}
