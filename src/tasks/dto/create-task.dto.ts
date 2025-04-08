/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  taskName: string;

  @IsBoolean()
  completed: boolean;
}
