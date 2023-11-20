/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TiendaEntity } from '../tienda/tienda.entity';

@Entity()
export class ProductoEntity {
@PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 name: string;
 
 @Column()
 price: number;
 
 @Column()
 type: string;

 @ManyToMany(() => TiendaEntity, tienda => tienda.productos)
 tiendas:TiendaEntity[];
}
