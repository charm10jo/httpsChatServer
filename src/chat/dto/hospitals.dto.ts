import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class HospitalsDto{
    @IsNotEmpty()
    @IsNumber()
    hospitalId:number;

    @IsNotEmpty()
    @IsString()
    hopitalName:string;

    @IsNotEmpty()
    @IsNumber()
    hospitalSize:number;

    @IsNotEmpty()
    @IsString()
    phoneNumber:string;

    @IsNotEmpty()
    @IsString()
    address:string;

    @IsNotEmpty()
    @IsString()
    mon:string;

    @IsNotEmpty()
    @IsString()
    tue:string;

    @IsNotEmpty()
    @IsString()
    wed:string;

    @IsNotEmpty()
    @IsString()
    thu:string;

    @IsNotEmpty()
    @IsString()
    fri:string;

    @IsNotEmpty()
    @IsString()
    sat:string;

    @IsNotEmpty()
    @IsString()
    sun:string;

    @IsNotEmpty()
    @IsString()
    holiday:string;

    @IsNotEmpty()
    @IsString()
    foreignLanguages:string;
}