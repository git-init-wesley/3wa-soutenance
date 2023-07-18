import { model, type Model } from 'mongoose';
import type { Task } from '../../task/task';
import { STask } from '../schemas/tasks-schema';

export const MTask: Model<Task> = model<Task>('tasks', STask);