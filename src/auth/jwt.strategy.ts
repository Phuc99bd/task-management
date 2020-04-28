import { PassportStrategy } from "@nestjs/passport"
import { Strategy , ExtractJwt} from "passport-jwt"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import * as dotenv from "dotenv"
import { JwtPayload } from "./jwt-payload.interface"
import { InjectRepository } from "@nestjs/typeorm"
import { UserRepository } from "./user.repository"
dotenv.config()

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWTTOKEN
        })
    }

    async validate(payload: JwtPayload){
        let { username } = payload;
        let user = await this.userRepository.findOne({username});        
        if(!user)
            throw new UnauthorizedException()
        return user;
    }
}