/* eslint-disable prettier/prettier */
import {IsNotEmpty, IsString} from 'class-validator';

export class TiendaDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly city: string;

    @IsString()
    @IsNotEmpty()
    readonly address:string;
}
