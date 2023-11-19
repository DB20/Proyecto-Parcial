/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class ProductoDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsNumber()
    @IsNotEmpty()
    readonly price: number;

    @IsString()
    @IsNotEmpty()
    readonly type:string;

}