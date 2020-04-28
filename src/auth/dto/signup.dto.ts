import { IsNotEmpty, Length, min, max, MinLength, IsString } from "class-validator"

export class AuthCredentialDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(5,{
        message: `Password is too short. Length latest 5`
    })
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5,{
        message: `Password is too short. Length latest 5`
    })
    password: string;
}