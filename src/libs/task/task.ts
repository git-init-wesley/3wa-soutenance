import type { Schema } from 'mongoose';

export class Task {

	// Basic but can add (but no change)
	title: string;
	description: string | undefined;
	content: string | undefined;

	//Basic
	created_at: Date | string;
	updated_at: Date | string;
	owner_uid: Schema.Types.UUID;


	constructor(title: string, description: string | undefined, content: string | undefined, created_at: Date | string, updated_at: Date | string, owner_uid: Schema.Types.UUID) {
		this.title = title;
		this.description = description;
		this.content = content;
		this.created_at = created_at;
		this.updated_at = updated_at;
		this.owner_uid = owner_uid;
	}
}