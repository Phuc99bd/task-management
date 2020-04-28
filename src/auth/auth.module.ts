import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule} from "@nestjs/jwt";
import * as dotenv from "dotenv";
import { PassportModule } from "@nestjs/passport"
import { JwtStrategy } from './jwt.strategy';

dotenv.config()

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy:'jwt'
    }),
    JwtModule.register({
      secret: process.env.JWTTOKEN,
      signOptions:{
        expiresIn: process.env.JWTEXPRIRE
      }
    })
    ,TypeOrmModule.forFeature([UserRepository])],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PassportModule
  ]
})

export class AuthModule {}
