import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialDto } from "./dto/signup.dto"
import { ConflictException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import * as dotenv from "dotenv";
dotenv.config()


@EntityRepository(User)
export class UserRepository extends Repository<User>{

    async signUp(signUp: AuthCredentialDto): Promise<void>{
        const { username , password} = signUp;
        const user = new User()
        user.username = username;
        user.password = password;
        try{
            await user.save();
        }catch(error){
            if(error.code === '23505'){
                throw new ConflictException('Username already exists')
            }
            else{
                throw new  InternalServerErrorException()
            }
        }
    }
    
}
