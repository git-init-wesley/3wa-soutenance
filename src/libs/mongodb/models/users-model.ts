import { model, type Model } from 'mongoose';
import { SUser } from '../schemas/users-schema';
import type { User } from '../../user/user';

export const MUser: Model<User> = model<User>('users', SUser);
