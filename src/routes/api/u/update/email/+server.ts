import { error } from '@sveltejs/kit';
import { RegexMail } from '../../../../../libs/utils/utils';
import { environmentServer } from '../../../../../environments/environment-server';
import Mongodb from '../../../../../libs/mongodb/mongodb';
import { MUser } from '../../../../../libs/mongodb/models/users-model';
import type { UserToken } from '../../../../../libs/user/user';
import moment from 'moment/moment';
import { dev } from '$app/environment';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {

	const old_email = url.searchParams.get('old_email');
	const new_email = url.searchParams.get('new_email');
	const token = url.searchParams.get('token');

	if (!old_email || !new_email || !token) throw error(400, { message: 'Error 400 : Bad request' });

	if (old_email === new_email)
		return new Response(JSON.stringify({
			code: 'auth/emails-are-same',
			message: 'Les adresses mail sont les mêmes.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/emails-are-same'
		});

	if (!RegexMail.test(old_email) || !RegexMail.test(new_email))
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

		let user = await MUser.findOne({ email: old_email }).exec();

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

		const updated_at = new Date().toISOString();
		user.updated_at = updated_at;
		await user.updateOne({ email: new_email, updated_at: updated_at });
		// noinspection JSDeprecatedSymbols
		await mongoServer.close();
		return new Response(JSON.stringify({
			username: user.username,
			tokens: user.tokens,
			role: user.role,
			created_at: user.created_at,
			updated_at: updated_at
		}), { status: 200 });
	} catch (e: any) {
		if (dev) console.log(e);
		throw error(500, { message: JSON.stringify(e.message) });
	}
}
