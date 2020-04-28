import { Controller, Post, Body, ValidationPipe, UseGuards, Req, Get } from '@nestjs/common';
import { AuthCredentialDto } from './dto/signup.dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){

    }

    @Post("/signup")
    async signUp(@Body(ValidationPipe) signUpDto: AuthCredentialDto): Promise<void>{
        await this.authService.signUp(signUpDto);
    }

    @Post("/signIn")
    async signIn(@Body(ValidationPipe) signInDto: AuthCredentialDto): Promise<object>{
        let token = await this.authService.signIn(signInDto)
        return {
            token: token
        };
    }
}
