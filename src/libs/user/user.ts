export class User {
	username: string;
	email: string;
	password: string;
	role: UserRoles;
	tokens: UserToken[];
	created_at: Date | string;
	updated_at: Date | string;


	constructor(username: string, email: string, password: string, role: UserRoles, tokens: UserToken[], created_at: Date | string, updated_at: Date | string) {
		this.username = username;
		this.email = email;
		this.password = password;
		this.role = role;
		this.tokens = tokens;
		this.created_at = created_at;
		this.updated_at = updated_at;
	}
}

export class UserToken {
	token: string;
	created_at: Date | string;

	constructor(token: string, created_at: Date | string) {
		this.token = token;
		this.created_at = created_at;
	}
}

export enum UserRoles {
	ADMIN = 'admin',
	USER = 'user'
}
