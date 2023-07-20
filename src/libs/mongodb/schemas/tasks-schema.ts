import { Schema } from 'mongoose';
import type { Task } from '../../task/task';

export const STask: Schema<Task> = new Schema<Task>({
	title: { required: true, type: Schema.Types.String },
	description: { required: false, type: Schema.Types.String },
	content: { required: false, type: Schema.Types.String },
	created_at: { required: false, type: Schema.Types.Date },
	updated_at: { required: false, type: Schema.Types.Date },
	owner_uid: { required: false, type: Schema.Types.ObjectId }
});