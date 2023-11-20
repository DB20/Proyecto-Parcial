/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { Repository } from 'typeorm';
import { ProductoEntity } from './producto.entity';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let productoList: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    productoList = [];
    for (let i = 0; i < 5; i++){
      const producto: ProductoEntity = await repository.save({
        name: faker.commerce.productMaterial(),
        price: faker.datatype.number(),
        type: "Perecedero"
      })
      productoList.push(producto);
    }
  }

  it('finAll should return all products', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(productoList.length)
  });

  it('findOne should return a product by id', async () => {
    const storedproducto: ProductoEntity = productoList[0];
    const producto: ProductoEntity = await service.findOne(storedproducto.id);
    expect(producto).not.toBeNull();
    expect(producto.name).toEqual(storedproducto.name)
    expect(producto.price).toEqual(storedproducto.price)
    expect(producto.type).toEqual(storedproducto.type)
  });

  it('findOne should throw an exception for an invalid product', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El producto con el id no fue encontrado")
  });

  it('create should return a new product', async () => {
    const producto: ProductoEntity = {
      id: "",
      name: faker.commerce.productMaterial(),
      price: faker.datatype.number(),
      type: "No perecedero",
      tiendas: []
    }
 
    const newProduct: ProductoEntity = await service.create(producto);
    expect(newProduct).not.toBeNull();
 
    const storedProduct: ProductoEntity = await repository.findOne({where: {id: newProduct.id}})
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(newProduct.name)
    expect(storedProduct.price).toEqual(newProduct.price)
    expect(storedProduct.type).toEqual(newProduct.type)
  });

  it('update should modify a product', async () => {
    const producto: ProductoEntity = productoList[0];
    producto.name = "New name";
    producto.price = 50;
     const updatedProduct: ProductoEntity = await service.update(producto.id, producto);
    expect(updatedProduct).not.toBeNull();
     const storedProduct: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(producto.name)
    expect(storedProduct.price).toEqual(producto.price)
  });

  it('update should throw an exception for an invalid product', async () => {
    let producto: ProductoEntity = productoList[0];
    producto = {
      ...producto, name: "New name", price: 50
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("message", "El Producto con el id no  fue encontrado")
  });

  it('delete should remove a product', async () => {
    const producto: ProductoEntity = productoList[0];
    await service.delete(producto.id);
     const deletedproduct: ProductoEntity = await repository.findOne({ where: { id: producto.id } })
    expect(deletedproduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    // const producto: ProductoEntity = productoList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El Producto con el id no fue encontrado")
  });

});
