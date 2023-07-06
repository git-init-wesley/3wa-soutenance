import { Schema } from 'mongoose';
import type { User } from '../../user/user';

export const SUser: Schema<User> = new Schema<User>({
	username: {
		type: Schema.Types.String,
		required: true,
		unique: true
	},
	email: {
		type: Schema.Types.String,
		required: true,
		unique: true
	},
	password: {
		type: Schema.Types.String,
		required: true
	},
	role: {
		type: Schema.Types.String,
		required: true
	},
	tokens: {
		type: Schema.Types.Mixed,
		required: false,
		default: []
	},
	created_at: {
		type: Schema.Types.Date,
		required: true
	},
	updated_at: {
		type: Schema.Types.Date,
		required: true
	}
});
