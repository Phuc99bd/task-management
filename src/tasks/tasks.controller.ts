import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilter } from './dto/get-task-filtert.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-vaildation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  private logger = new Logger('TaskController')
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Query(ValidationPipe) filterTaskDto: GetTaskFilter,@Req() req
  ): Promise<Task[]> {
    this.logger.verbose(`User "${req.user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterTaskDto)}`)
    return this.tasksService.getTaskFilter(filterTaskDto,req.user);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number,@Req() req): Promise<Task> {
    return this.tasksService.getTaskById(id,req.user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto,@Req() req): Promise<Task> {
    return this.tasksService.createTask(createTaskDto,req.user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Body('status', new TaskStatusValidationPipe()) status: TaskStatus,
    @Param('id', ParseIntPipe) id: number,
    @Req() req
  ): Promise<Task> {
    return this.tasksService.updateTask(id, status,req.user);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: number,@Req() req) {
    await this.tasksService.deleteTask(id,req.user);
  }
}
