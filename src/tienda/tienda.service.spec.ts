/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { TiendaService } from './tienda.service';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TiendaEntity } from './tienda.entity';

describe('TiendaService', () => {
  let service: TiendaService;
  let repository: Repository<TiendaEntity>;
  let tiendaList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [TiendaService],
    }).compile();

    service = module.get<TiendaService>(TiendaService);
    repository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    tiendaList = [];
    for (let i = 0; i < 5; i++){
      const tienda: TiendaEntity = await repository.save({
        name: faker.commerce.productMaterial(),
        city: "AME",
        address: "Av 1234"
      })
      tiendaList.push(tienda);
    }
  }

  it('finAll should return all stores', async () => {
    const tiendas: TiendaEntity[] = await service.findAll();
    expect(tiendas).not.toBeNull();
    expect(tiendas).toHaveLength(tiendaList.length)
  });

  it('findOne should return a stores by id', async () => {
    const storedtienda: TiendaEntity = tiendaList[0];
    const tienda: TiendaEntity = await service.findOne(storedtienda.id);
    expect(tienda).not.toBeNull();
    expect(tienda.name).toEqual(storedtienda.name)
    expect(tienda.city).toEqual(storedtienda.city)
    expect(tienda.address).toEqual(storedtienda.address)
  });

  it('findOne should throw an exception for an invalid stores', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La tienda con el id no fue encontrada")
  });

  it('create should return an error', async () => {
    const tienda: TiendaEntity = {
      id: "",
      name: faker.commerce.productMaterial(),
      city: faker.word.adjective(5),
      address: "No perecedero",
      productos: []
    }
    await expect(() => service.create(tienda)).rejects.toHaveProperty("message", "La ciudad debe de seguir código de 3 letras")

  });

  it('create should return a new stores', async () => {
    const tienda: TiendaEntity = {
      id: "",
      name: faker.commerce.productMaterial(),
      city: "BOG",
      address: "No perecedero",
      productos: []
    }
 
    const newProduct: TiendaEntity = await service.create(tienda);
    expect(newProduct).not.toBeNull();
 
    const storedProduct: TiendaEntity = await repository.findOne({where: {id: newProduct.id}})
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(newProduct.name)
    expect(storedProduct.city).toEqual(newProduct.city)
    expect(storedProduct.address).toEqual(newProduct.address)
  });

  it('update should modify a product', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    tienda.name = "New name";
    tienda.city = "BOG";
     const updatedProduct: TiendaEntity = await service.update(tienda.id, tienda);
    expect(updatedProduct).not.toBeNull();
     const storedProduct: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.name).toEqual(tienda.name)
    expect(storedProduct.city).toEqual(tienda.city)
  });

  it('update should throw an exception for an invalid product', async () => {
    let tienda: TiendaEntity = tiendaList[0];
    tienda = {
      ...tienda, name: "New name", city: "BOG"
    }
    await expect(() => service.update("0", tienda)).rejects.toHaveProperty("message", "La tienda con el id no  fue encontrada")
  });

  it('delete should remove a product', async () => {
    const tienda: TiendaEntity = tiendaList[0];
    await service.delete(tienda.id);
     const deletedproduct: TiendaEntity = await repository.findOne({ where: { id: tienda.id } })
    expect(deletedproduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    // const tienda: TiendaEntity = tiendaList[0];
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La tienda con el id no fue encontrada")
  });
});
