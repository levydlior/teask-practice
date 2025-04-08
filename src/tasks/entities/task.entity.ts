import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskName: string;

  @Column()
  completed: boolean;

  @ManyToOne(() => User, (user) => user.tasks, {
    onDelete: 'CASCADE',
  })
  user: User;
}
