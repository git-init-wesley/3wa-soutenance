import type { Types } from 'mongoose';

export class Task {

	// Basic but can add (but no change)
	title: string;
	finished: boolean;
	description: string | undefined;
	content: string | undefined;

	//Basic
	created_at: Date | string;
	updated_at: Date | string;
	owner_uid: Types.ObjectId;


	constructor(title: string, finished: boolean, description: string | undefined, content: string | undefined, created_at: Date | string, updated_at: Date | string, owner_uid: Types.ObjectId) {
		this.title = title;
		this.finished = finished;
		this.description = description;
		this.content = content;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.owner_uid = owner_uid;
	}
}