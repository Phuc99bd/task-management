import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilter } from './dto/get-task-filtert.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: TaskRepository,
  ) {}

  async getTaskFilter(filterDto: GetTaskFilter,user: User): Promise<Task[]> {
     return await this.taskRepository.getTasks(filterDto,user);
  }

  async getTaskById(id: number,user: User): Promise<Task> {    
    const found = await this.taskRepository.findOne({where: { id, userId: user.id}});
    if (!found) throw new NotFoundException(`Task with Id: ${id} not found`);
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto,user: User): Promise<Task> {
      let task =await this.taskRepository.createTask(createTaskDto,user);
      return task;
  }

  async deleteTask(id: number,user: User): Promise<void>{
      let result = await this.taskRepository.delete({ id , userId: user.id});      
      if(result.affected ===0){
        throw new NotFoundException(`Task with Id "${id}" not found`);
      }
  }

  async updateTask(id: number , status: TaskStatus,user: User): Promise<Task>{
      const task = await this.getTaskById(id,user);
      task.status = status;
      await task.save();
      return task;
  }
}
