import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/signup.dto';
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService){
    }
    async signUp(signUp: AuthCredentialDto): Promise<void>{
        await this.userRepository.signUp(signUp);
    }
    async signIn(signIn: AuthCredentialDto): Promise<string>{
        let { username , password} = signIn;
        let user = await this.userRepository.findOne({ username})
        if(!user){
            throw new UnauthorizedException('Invalid credentials')
        }
        if(!user.comparePassword(password)){
            throw new NotFoundException('Sai tai khoản và mật khẩu')
        }

        const payload = { username };
        const accessToken = await this.jwtService.sign(payload);

        return accessToken;
    }
}
