import { TaskStatus } from "../task-status.enum";
import { IsOptional, IsIn, IsNotEmpty } from "class-validator"
 
export class GetTaskFilter{
    @IsOptional()
    @IsIn([TaskStatus.OPEN,TaskStatus.IN_PROCESS,TaskStatus.DONE])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string
}