import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { environmentServer } from '../../../../../../environments/environment-server';
import Mongodb from '../../../../../../libs/mongodb/mongodb';
import { RegexMail, RegexUsername } from '../../../../../../libs/utils/utils';
import { MUser } from '../../../../../../libs/mongodb/models/users-model';
import { UserRoles, UserToken } from '../../../../../../libs/user/user';
import moment from 'moment';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	const email = url.searchParams.get('email');
	const token = url.searchParams.get('token');

	const old_username = url.searchParams.get('old_username');
	const new_username = url.searchParams.get('new_username');

	if (!email || !token || !old_username || !new_username) throw error(400, { message: 'Error 400 : Bad request' });

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

		let existsUser = await MUser.exists({ username: new_username }).exec();
		if (existsUser !== null)
			return new Response(JSON.stringify({
				code: 'auth/username-already-in-use',
				message: 'Pseudonyme déjà utilisé.'
			}), {
				status: 406,
				statusText: 'Error 406 : auth/username-already-in-use'
			});

		let findUser = await MUser.findOne({ username: old_username }).exec();

		if (!findUser) return new Response(JSON.stringify({
			code: 'auth/user-does-not-exist',
			message: 'L\'utilisateur n\'existe pas.'
		}), {
			status: 406,
			statusText: 'Error 406 : auth/user-does-not-exist'
		});

		const updated_at = new Date().toISOString();
		findUser.updated_at = updated_at;
		await findUser.updateOne({ username: new_username, updated_at: updated_at });

		// noinspection JSDeprecatedSymbols
		await mongoServer.close();

		return new Response(JSON.stringify({
			id: findUser._id.toHexString(),
			email: findUser.email,
			username: new_username,
			role: findUser.role,
			created_at: findUser.created_at,
			updated_at: updated_at
		}), { status: 200 });
	} catch (e: any) {
		if (dev) console.log(e);
		throw error(500, { message: JSON.stringify(e.message) });
	}
}
