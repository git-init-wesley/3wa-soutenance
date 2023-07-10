import { error } from '@sveltejs/kit';
import { MUser } from '../../../../../libs/mongodb/models/users-model';
import * as bcrypt from 'bcrypt';
import { environmentServer } from '../../../../../environments/environment-server';
import Mongodb from '../../../../../libs/mongodb/mongodb';
import { RegexMail, RegexPassword, uuid_e4 } from '../../../../../libs/utils/utils';
import { to_number } from 'svelte/internal';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {

	const email = url.searchParams.get('email');
	const password = url.searchParams.get('password');

	if (!email || !password) throw error(400, { message: 'Error 400 : Bad request' });

	if (!RegexMail.test(email))
		return new Response(JSON.stringify({
			code: 'auth/invalid-email',
			message: 'Adresse mail invalide.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/invalid-email'
		});

	if (!RegexPassword.test(password))
		return new Response(JSON.stringify({
			code: 'auth/invalid-password',
			message: 'Mot de passe invalide.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/invalid-password'
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

	if (!bcrypt.compareSync(password, user.password)) return new Response(JSON.stringify({
		code: 'auth/wrong-password',
		message: 'Mot de passe incorrect.'
	}), {
		status: 403,
		statusText: 'Error 403 : auth/wrong-password'
	});

	let newToken = bcrypt.hashSync((user.password + uuid_e4()), to_number(environmentServer.saltRounds));

	let tokens = user.tokens;
	tokens.push({
		token: newToken,
		created_at: new Date().toISOString()
	});

	user.tokens = tokens;

	try {
		await user.updateOne({ tokens: tokens });
		// noinspection JSDeprecatedSymbols
		await mongoServer.close();
		return new Response(JSON.stringify({
			token: newToken, username: user.username,
			tokens: user.tokens,
			role: user.role
		}), { status: 200 });
	} catch (e: any) {
		console.log(e);
		throw error(500, { message: JSON.stringify(e.message) });
	}
}
