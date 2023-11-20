/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductoTiendaService } from './producto-tienda.service';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TiendaEntity } from '../tienda/tienda.entity';

describe('ProductoTiendaService', () => {
  let service: ProductoTiendaService;
  let productoRepository: Repository<ProductoEntity>;
  let tiendaRepository: Repository<TiendaEntity>;
  let productosList: ProductoEntity[];
  let tiendasList: TiendaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoTiendaService],
    }).compile();

    service = module.get<ProductoTiendaService>(ProductoTiendaService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    tiendaRepository = module.get<Repository<TiendaEntity>>(getRepositoryToken(TiendaEntity));

    await seedDatabase();
  });
  const seedDatabase = async () => {
    tiendaRepository.clear();
    productoRepository.clear();

    tiendasList = [];
    for(let i = 0; i < 5; i++){
        const tienda: TiendaEntity = await tiendaRepository.save({
          name: faker.commerce.productMaterial(),
          city: "AME",
          address: "Av 1234"
        })
        tiendasList.push(tienda);
    }
    productosList = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await productoRepository.save({
          name: faker.commerce.productMaterial(),
          price: faker.datatype.number(),
          type: "Perecedero",
          tiendas: [tiendasList[i]]
        })
        productosList.push(producto);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addStoreToProduct should add an store to a product', async () => {
    const newStore: TiendaEntity = await tiendaRepository.save({
      name: faker.commerce.productMaterial(), 
      city: "AME",
      address: "Av 1234"
    });

    const newProduct: ProductoEntity = await productoRepository.save({
      name: faker.commerce.productMaterial(),
      price: faker.datatype.number(),
      type: "Perecedero"
    })
    const result: ProductoEntity = await service.addStoreToProduct(newProduct.id, newStore.id);
    
    expect(result.tiendas.length).toBe(1);
    expect(result.tiendas[0]).not.toBeNull();
    expect(result.tiendas[0].name).toBe(newStore.name)
    expect(result.tiendas[0].city).toBe(newStore.city)
  });


  it('findStoreFromProduct should throw an exception for an invalid tienda', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.findStoreFromProduct(producto.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('findStoreFromProduct should throw an exception for an invalid product', async () => {
    const tienda: TiendaEntity = tiendasList[0]; 
    await expect(()=> service.findStoreFromProduct("0", tienda.id)).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('findStoreFromProduct should throw an exception for an culture not associated to the product', async () => {
    const newStore: TiendaEntity = await tiendaRepository.save({
      name: faker.commerce.productMaterial(),
      city: "AME",
      address: "Av 1234"
    });
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.findStoreFromProduct(producto.id, newStore.id)).rejects.toHaveProperty("message", "El producto con el Id dado no está asociado a la tienda con el id seleccionado"); 
  });

  it('findStoresFromProduct should return cultures by product', async ()=>{
    const producto: ProductoEntity = productosList[0];
    const tiendas: TiendaEntity[] = await service.findStoresFromProduct(producto.id);
    expect(tiendas.length).toBe(1)
  });

  it('findStoresFromProduct should throw an exception for an invalid product', async () => {
    await expect(()=> service.findStoresFromProduct("0")).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('updateStoresFromProduct should update cultures list for a product', async () => {
    const newStore: TiendaEntity = await tiendaRepository.save({
      name: faker.commerce.productMaterial(),
        city: "AME",
        address: "Av 1234"
    });
    const producto: ProductoEntity = productosList[0];
    const updatedProduct: ProductoEntity = await service.updateStoresFromProduct(producto.id, [newStore]);
    expect(updatedProduct.tiendas.length).toBe(1);

    expect(updatedProduct.tiendas[0].name).toBe(newStore.name);
    expect(updatedProduct.tiendas[0].city).toBe(newStore.city);
  });

  it('updateStoresFromProduct should throw an exception for an invalid product', async () => {
    const newStore: TiendaEntity = await tiendaRepository.save({
      name: faker.commerce.productMaterial(),
        city: "AME",
        address: "Av 1234"
    });

    await expect(()=> service.updateStoresFromProduct("0", [newStore])).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('updateStoresFromProduct should throw an exception for an invalid store', async () => {
    const newStore: TiendaEntity = tiendasList[0];
    newStore.id = "0";
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.updateStoresFromProduct(producto.id, [newStore])).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteStoreFromProduct should remove an store from a product', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    const producto: ProductoEntity = productosList[0];
    await service.deleteStoreFromProduct(producto.id, tienda.id);

    const storedProduct: ProductoEntity = await productoRepository.findOne({where: {id: producto.id}, relations: ["tiendas"]});
    const deletedCulture: TiendaEntity = storedProduct.tiendas.find(a => a.id === tienda.id);

    expect(deletedCulture).toBeUndefined();

  });

  it('deleteStoreFromProduct should thrown an exception for an invalid tienda', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.deleteStoreFromProduct(producto.id, "0")).rejects.toHaveProperty("message", "The tienda with the given id was not found"); 
  });

  it('deleteStoreFromProduct should thrown an exception for an invalid product', async () => {
    const tienda: TiendaEntity = tiendasList[0];
    await expect(()=> service.deleteStoreFromProduct("0", tienda.id)).rejects.toHaveProperty("message", "The producto with the given id was not found"); 
  });

  it('deleteStoreFromProduct should thrown an exception for an non asocciated tienda', async () => {
    const newStore: TiendaEntity = await tiendaRepository.save({
      name: faker.commerce.productMaterial(),
        city: "AME",
        address: "Av 1234"
    });
    const producto: ProductoEntity = productosList[0];
    await expect(()=> service.deleteStoreFromProduct(producto.id, newStore.id)).rejects.toHaveProperty("message", "The tienda with the given id is not associated to the producto"); 
  }); 
});
