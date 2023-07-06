import { error } from '@sveltejs/kit';
import { MUser } from '../../../../libs/mongodb/models/users-model';
import { UserRoles } from '../../../../libs/user/user';
import { environmentServer } from '../../../../environments/environment-server';
import * as bcrypt from 'bcrypt';
import Mongodb from '../../../../libs/mongodb/mongodb';
import { RegexMail, RegexPassword, RegexUsername, uuid_e4 } from '../../../../libs/utils/utils';
import { to_number } from 'svelte/internal';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {

	const username = url.searchParams.get('username');
	const email = url.searchParams.get('email');
	const password = url.searchParams.get('password');

	if (!username || !email || !password) throw error(400, { message: 'Error 400 : Bad request' });

	if (!RegexMail.test(email))
		return new Response(JSON.stringify({
			code: 'auth/invalid-email',
			message: 'Adresse mail invalide.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/invalid-email'
		});
	if (!RegexUsername.test(username))
		return new Response(JSON.stringify({
			code: 'auth/invalid-username',
			message: 'Pseudonyme invalide.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/invalid-username'
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

	let existsUser = await MUser.exists({ username: username }).exec();
	if (existsUser !== null)
		return new Response(JSON.stringify({
			code: 'auth/username-already-in-use',
			message: 'Pseudonyme déjà utilisé.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/username-already-in-use'
		});

	existsUser = await MUser.exists({ email: email }).exec();
	if (existsUser !== null)
		return new Response(JSON.stringify({
			code: 'auth/email-already-in-use',
			message: 'Adresse mail déjà utilisée.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/email-already-in-use'
		});

	try {
		let isoString = new Date().toISOString();
		let hash = bcrypt.hashSync(password, to_number(environmentServer.saltRounds));
		let firstToken = bcrypt.hashSync((hash + uuid_e4()), to_number(environmentServer.saltRounds));
		await new MUser({
			username: username,
			email: email,
			password: hash,
			created_at: isoString,
			updated_at: isoString,
			role: UserRoles.USER.toString(),
			tokens: [
				{
					token: firstToken,
					created_at: isoString
				}
			]
		}).save();
		// noinspection JSDeprecatedSymbols
		await mongoServer.close();
		return new Response(JSON.stringify({
			token: firstToken
		}), { status: 200 });
	} catch (e: any) {
		console.log(e);
		throw error(500, { message: JSON.stringify(e.message) });
	}
}
