import { error } from '@sveltejs/kit';
import { RegexMail, RegexPassword } from '../../../../../libs/utils/utils';
import { environmentServer } from '../../../../../environments/environment-server';
import Mongodb from '../../../../../libs/mongodb/mongodb';
import { MUser } from '../../../../../libs/mongodb/models/users-model';
import type { UserToken } from '../../../../../libs/user/user';
import moment from 'moment/moment';
import { dev } from '$app/environment';
import * as bcrypt from 'bcrypt';
import { to_number } from 'svelte/internal';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {

	const email = url.searchParams.get('email');
	const new_password = url.searchParams.get('new_password');
	const token = url.searchParams.get('token');

	if (!email || !new_password || !token) throw error(400, { message: 'Error 400 : Bad request' });

	if (!RegexMail.test(email))
		return new Response(JSON.stringify({
			code: 'auth/invalid-email',
			message: 'Adresse mail invalide.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/invalid-email'
		});

	if (!RegexPassword.test(new_password))
		return new Response(JSON.stringify({
			code: 'auth/invalid-password',
			message: 'Mot de passe invalide.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/invalid-password'
		});

	if (!environmentServer.mongoUri) throw error(503, { message: 'Error 503 : MISSING_ENV_295XM' });
	if (!environmentServer.saltRounds) throw error(503, { message: 'Error 503 : MISSING_ENV_926VA' });

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

	try {
		let hash = bcrypt.hashSync(new_password, to_number(environmentServer.saltRounds));
		const updated_at = new Date().toISOString();
		user.updated_at = updated_at;
		await user.updateOne({ password: hash, updated_at: updated_at });
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
