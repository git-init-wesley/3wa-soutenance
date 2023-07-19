import { error } from '@sveltejs/kit';
import { MUser } from '../../../../../libs/mongodb/models/users-model';
import type { UserToken } from '../../../../../libs/user/user';
import { environmentServer } from '../../../../../environments/environment-server';
import Mongodb from '../../../../../libs/mongodb/mongodb';
import { RegexMail } from '../../../../../libs/utils/utils';
import moment from 'moment';
import { dev } from '$app/environment';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {

	const email = url.searchParams.get('email');
	const token = url.searchParams.get('token');

	if (!email || !token) throw error(400, { message: 'Error 400 : Bad request' });

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

		// noinspection JSDeprecatedSymbols
		await mongoServer.close();

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

		let today = new Date();
		let diff_date = moment(today).diff(moment(userToken.created_at));
		let nbr_days = diff_date / 1000 / 60 / 60 / 24;

		if (nbr_days < 30)
			return new Response(JSON.stringify({
				token: token,
				username: user.username,
				tokens: user.tokens,
				role: user.role,
				created_at: user.created_at,
				updated_at: user.updated_at
			}), { status: 200 });
		else
			return new Response(JSON.stringify({
				code: 'auth/token-expired',
				message: 'La clé de sécurité est expirée.'
			}), {
				status: 403,
				statusText: 'Error 403 : auth/token-expired'
			});
	} catch (e: any) {
		if (dev) console.log(e);
		throw error(500, { message: JSON.stringify(e.message) });
	}
}
