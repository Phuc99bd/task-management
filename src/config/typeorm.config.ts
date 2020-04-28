import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import * as dotenv from "dotenv";
dotenv.config()

export const typeOrmConfig: TypeOrmModuleOptions ={
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: process.env.USERPOSTGRESQL,
    password: process.env.PASSWORD,
    database: 'taskmanagement',
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    synchronize: true
}