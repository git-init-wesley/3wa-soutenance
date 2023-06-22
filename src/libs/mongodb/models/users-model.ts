import { model, type Model } from 'mongoose';
import { SUser } from '../schemas/users-schema';

export const MUser: Model<User> = model<User>('users', SUser);
