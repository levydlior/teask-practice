import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';

// ✅ Load environment variables
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST, // ✅ Use env variable
  port: Number(process.env.DB_PORT), // ✅ Convert string to number
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Task],
  migrations: [__dirname + '/migrations/*.ts'],
});
