import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class BotMessageDto {
    // @IsNumber()
    // @IsNotEmpty()
    // division: string;

    @IsString()
    @IsNotEmpty()
    symptoms: string;

    @IsNumber()
    @IsNotEmpty()
    nmm: number;

    @IsNumber()
    @IsNotEmpty()
    priority: number;

    @IsString()
    @IsNotEmpty()
    region: string;

    @IsString()
    @IsNotEmpty()
    language: string;
    
    @IsNumber()
    @IsNotEmpty()
    latitude : number;

    @IsNumber()
    @IsNotEmpty()
    longitude : number;
    
    @IsBoolean()
    @IsNotEmpty()
    retry : boolean;
}

export default BotMessageDto