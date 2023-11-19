/* eslint-disable prettier/prettier */
import { ProductoEntity } from 'src/producto/producto.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TiendaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
   
    @Column()
    name: string;
    
    @Column()
    city: string;
    
    @Column()
    address: string;  

    @ManyToMany(() => ProductoEntity, producto => producto.tiendas)
    @JoinTable()
    productos: ProductoEntity[];
}
