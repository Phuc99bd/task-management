import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilter } from './dto/get-task-filtert.dto';
import { NotFoundException } from '@nestjs/common';
import { throws } from 'assert';

const mockTaskRepository = ()=>({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    delete: jest.fn()
})
const mockuser = {
    username: 'Phuc',
    id: 12
}

describe('Task service',()=>{
    let taskService;
    let taskRepository;

    beforeEach(async ()=>{
        const module = await Test.createTestingModule({
            providers:[
                TasksService,
                { provide: TaskRepository,useFactory: mockTaskRepository}
            ]
        }).compile()

        taskService = await module.get<TasksService>(TasksService)
        taskRepository = await module.get<TaskRepository>(TaskRepository)        
    })

    describe('getTasks', () => {
        it('gets all tasks from the repository',async ()=>{
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTaskFilter= { status: TaskStatus.IN_PROCESS , search: ''};
            taskRepository.getTasks.mockResolvedValue('Somevalue');
            let result = await  taskService.getTaskFilter(filters,mockuser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toBe('Somevalue')
        })
    })

    describe('Get task by ID',()=>{
        it('get a tasks from taskService',async()=>{
            taskRepository.findOne.mockResolvedValue({ title:'abc', description:':D'})
            const result = await taskService.getTaskById(1,mockuser);
            expect(taskRepository.findOne).toHaveBeenCalledWith({ where:{ id: 1,userId: mockuser.id}})
            expect(result).toEqual({ title:'abc', description:':D'})
        })

        it('throws an error as task is not found',()=>{
            taskRepository.findOne.mockResolvedValue(null);
            expect(taskService.getTaskById(1,mockuser)).rejects.toThrow(NotFoundException);
        })
    })
    
    describe('Create new task',()=>{
        it('create new task from task repository',async()=>{
            taskRepository.createTask.mockResolvedValue('SomeTask')
            let createTaskDto = { title: 'abc' , description:'abc'}
            let result =await  taskService.createTask(createTaskDto,mockuser);
            expect(result).toEqual('SomeTask')
            expect(taskRepository.createTask).toHaveBeenCalled()
        })
    })

    describe('Update task', () => {
      

        it('throw error as task is not found',async ()=>{
            taskRepository.updateTask.mockResolvedValue(null)
            expect(taskService.updateTask(1,TaskStatus.DONE,mockuser)).rejects.toThrow(NotFoundException)
        })
    })
    
    describe('delete a Task',()=>{
        it('delete a task from task repository',async ()=>{
            taskRepository.delete.mockResolvedValue('Deleted')
            await taskService.deleteTask(1,mockuser);
            expect(taskRepository.delete).toHaveBeenCalled()
        })
    })
})