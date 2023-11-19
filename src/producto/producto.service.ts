/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';
import { ProductoEntity } from './producto.entity';


@Injectable()
export class ProductoService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ){}

    async findAll(): Promise<ProductoEntity[]> {
        return await this.productoRepository.find({ relations: ["tiendas"]});
    }

    async findOne(id: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id}, relations: ["tiendas"]});
        if (!producto)
            throw new BusinessLogicException("El producto con el id no fue encontrado", BusinessError.NOT_FOUND);

        return producto;
    }

    async create(producto: ProductoEntity): Promise<ProductoEntity> {
        this.validateProductType(producto.type);
        return await this.productoRepository.save(producto);
    }

    async update(id: string, producto: ProductoEntity): Promise<ProductoEntity> {
        this.validateProductType(producto.type);
        const productobase: ProductoEntity = await this.productoRepository.findOne({where: {id}});

        if (!productobase)
            throw new BusinessLogicException("El Producto con el id no  fue encontrado", BusinessError.NOT_FOUND);
        return await this.productoRepository.save({...productobase, ...producto})
    }

    async delete(id: string) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {id}});
        if (!producto)
            throw new BusinessLogicException("El Producto con el id no fue encontrado", BusinessError.NOT_FOUND);
        await this.productoRepository.remove(producto);
    }
    private validateProductType(type: string): void {
        // Add your validation logic here
        const validTypes = ["Perecedero", "No perecedero"];

        if (!validTypes.includes(type)) {
            throw new BusinessLogicException("Tipo de producto no válido. Debe ser 'Perecedero' o 'No perecedero'.", BusinessError.PRECONDITION_FAILED);
        }
    }

}
