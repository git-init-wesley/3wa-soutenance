import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { environmentServer } from '../../../../../../environments/environment-server';
import Mongodb from '../../../../../../libs/mongodb/mongodb';
import { MTask } from '../../../../../../libs/mongodb/models/tasks-model';
import { RegexMail } from '../../../../../../libs/utils/utils';
import { MUser } from '../../../../../../libs/mongodb/models/users-model';
import { UserRoles, UserToken } from '../../../../../../libs/user/user';
import moment from 'moment';
import { Types } from 'mongoose';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	const email = url.searchParams.get('email');
	const token = url.searchParams.get('token');

	const user_id = url.searchParams.get('user_id');

	if (!email || !token || !user_id) throw error(400, { message: 'Error 400 : Bad request' });

	if (!RegexMail.test(email))
		return new Response(JSON.stringify({
			code: 'auth/invalid-email',
			message: 'Adresse mail invalide.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/invalid-email'
		});

	if (!environmentServer.mongoUri) throw error(503, { message: 'Error 503 : MISSING_ENV_295XM' });

	try {
		const mongoServer = new Mongodb(environmentServer.mongoUri, '3wa');
		await mongoServer.init();

		let user = await MUser.findOne({ email: email }).exec();

		if (!user) return new Response(JSON.stringify({
			code: 'auth/user-does-not-exist',
			message: 'L\'utilisateur n\'existe pas.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/user-does-not-exist'
		});

		let userToken: UserToken | undefined = user.tokens.find(s => s.token === token);
		if (!userToken) return new Response(JSON.stringify({
			code: 'auth/token-invalid',
			message: 'La clé de sécurité est invalide.'
		}), {
			status: 403,
			statusText: 'Error 403 : auth/token-invalid'
		});

		if ((moment(new Date()).diff(moment(userToken.created_at)) / 1000 / 60 / 60 / 24) >= 30)
			return new Response(JSON.stringify({
				code: 'auth/token-expired',
				message: 'La clé de sécurité est expirée.'
			}), {
				status: 403,
				statusText: 'Error 403 : auth/token-expired'
			});

		if (user.role !== UserRoles.ADMIN) return new Response(JSON.stringify({
			code: 'auth/permission-denied',
			message: 'Vous n\'avez pas la permission.'
		}), {
			status: 403,
			statusText: 'Error 403 : auth/permission-denied'
		});

		let tasks_by_user_count = await MTask.count({ owner_uid: new Types.ObjectId(user_id) }).exec();

		// noinspection JSDeprecatedSymbols
		await mongoServer.close();

		return new Response(JSON.stringify({
			tasks_by_user_count: tasks_by_user_count,
			stats_at: new Date().toISOString()
		}), { status: 200 });
	} catch (e: any) {
		if (dev) console.log(e);
		throw error(500, { message: JSON.stringify(e.message) });
	}
}
