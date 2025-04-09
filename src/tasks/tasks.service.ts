import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { TaskResponseDto } from './dto/task-response.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
    userId: number,
  ): Promise<TaskResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const task = this.taskRepository.create({
      ...createTaskDto,
      user,
    });

    const savedTask = await this.taskRepository.save(task);

    return {
      id: savedTask.id,
      taskName: savedTask.taskName,
      completed: savedTask.completed,
      userId: savedTask.user.id,
    };
  }

  async findAllForUser(userId: number): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    return tasks.map((task) => ({
      id: task.id,
      taskName: task.taskName,
      completed: task.completed,
      userId: task.user.id,
    }));
  }
  // findOne(id: number) {
  //   return `This action returns a #${id} task`;
  // }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);

    await this.taskRepository.update(id, updateTaskDto);

    const updatedTask = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found after update`);
    }

    return {
      id: updatedTask.id,
      taskName: updatedTask.taskName,
      completed: updatedTask.completed,
      userId: updatedTask.user.id,
    };
  }

  async remove(id: number): Promise<void> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    await this.taskRepository.remove(task);
  }
}
