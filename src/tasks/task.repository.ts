import { Task } from "./task.entity";
import { Repository, EntityRepository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTaskFilter } from "./dto/get-task-filtert.dto";
import { User } from "../auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    async getTasks(filterTaskDto: GetTaskFilter,user: User): Promise<Task[]>{
        const { status , search } = filterTaskDto;
        const query = this.createQueryBuilder('task');

        query.andWhere('task.userId = :userId',{userId: user.id})
        if(status){
            query.andWhere('task.status= :status',{status: status})
        }
        if(search)
            query.andWhere('task.title LIKE :search OR task.description LIKE :search',{search: `%${search}%`})
        const tasks =await query.getMany();
        return tasks;
    }

    async createTask(createTaskDto: CreateTaskDto,user: User): Promise<Task> {
        let { title, description } = createTaskDto;
        let task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        return task;
   }
}