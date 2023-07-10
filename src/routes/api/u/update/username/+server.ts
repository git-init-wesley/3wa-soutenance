import { error } from '@sveltejs/kit';
import { RegexUsername } from '../../../../../libs/utils/utils';
import { environmentServer } from '../../../../../environments/environment-server';
import Mongodb from '../../../../../libs/mongodb/mongodb';
import { MUser } from '../../../../../libs/mongodb/models/users-model';
import type { UserToken } from '../../../../../libs/user/user';
import moment from 'moment/moment';
import { dev } from '$app/environment';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {

	const old_username = url.searchParams.get('old_username');
	const new_username = url.searchParams.get('new_username');
	const token = url.searchParams.get('token');

	if (!old_username || !new_username || !token) throw error(400, { message: 'Error 400 : Bad request' });

	if (old_username === new_username)
		return new Response(JSON.stringify({
			code: 'auth/usernames-are-same',
			message: 'Les pseudonymes sont les mêmes.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/usernames-are-same'
		});

	if (!RegexUsername.test(old_username) || !RegexUsername.test(new_username))
		return new Response(JSON.stringify({
			code: 'auth/invalid-username',
			message: 'Pseudonyme invalide.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/invalid-username'
		});

	if (!environmentServer.mongoUri) throw error(503, { message: 'Error 503 : MISSING_ENV_295XM' });

	const mongoServer = new Mongodb(environmentServer.mongoUri, '3wa');
	await mongoServer.init();

	let user = await MUser.findOne({ username: old_username }).exec();

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

	try {
		await user.updateOne({ username: new_username });
		// noinspection JSDeprecatedSymbols
		await mongoServer.close();
		return new Response(JSON.stringify({
			username: new_username,
			tokens: user.tokens,
			role: user.role
		}), { status: 200 });
	} catch (e: any) {
		if (dev) console.log(e);
		throw error(500, { message: JSON.stringify(e.message) });
	}
}