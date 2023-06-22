import { env } from '$env/dynamic/private';

export const environmentServer = {
	mongoUri: env['MONGO_DBADMIN_URI'],
	saltRounds: env['SALT_ROUNDS']
};
