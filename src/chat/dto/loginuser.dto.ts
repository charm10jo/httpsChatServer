import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUserDto {
    @IsNotEmpty({message: 'Id 안적으심.'})
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    Id: string;

    @IsNotEmpty({message: '비번 안적으심.'})
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    @Matches(/^[a-zA-z0-9]*$/, {
        message: '비번은 영문이나 숫자 1~20자로 지으셨어야 해요.'
    })
    password: string;
}