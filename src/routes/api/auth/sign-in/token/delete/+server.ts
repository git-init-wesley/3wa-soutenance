import { error } from '@sveltejs/kit';
import { environmentServer } from '../../../../../../environments/environment-server';
import Mongodb from '../../../../../../libs/mongodb/mongodb';
import { MUser } from '../../../../../../libs/mongodb/models/users-model';
import { RegexMail } from '../../../../../../libs/utils/utils';
import type { UserToken } from '../../../../../../libs/user/user';

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

	let tokens = user.tokens.filter(f => f.token !== token);
	user.tokens = tokens;

	try {
		await user.updateOne({ tokens: tokens });
		// noinspection JSDeprecatedSymbols
		await mongoServer.close();
		return new Response(JSON.stringify({
			username: user.username,
			tokens: user.tokens,
			role: user.role
		}), { status: 200 });
	} catch (e: any) {
		console.log(e);
		throw error(500, { message: JSON.stringify(e.message) });
	}
}
