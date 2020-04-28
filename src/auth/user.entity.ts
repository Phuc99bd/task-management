import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, BeforeInsert, Unique, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { Task } from "../tasks/task.entity";


@Entity('user')
@Unique(['username'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(type=>Task,task=>task.user,{ eager: true})
    tasks: Task[]

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password,10);
    }

    async comparePassword(attempt: string): Promise<boolean>{
        return await bcrypt.compare(attempt,this.password)
    }
}