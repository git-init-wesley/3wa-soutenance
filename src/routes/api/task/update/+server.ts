import { error } from '@sveltejs/kit';
import moment from 'moment/moment';
import { RegexMail } from '../../../../libs/utils/utils';
import { environmentServer } from '../../../../environments/environment-server';
import Mongodb from '../../../../libs/mongodb/mongodb';
import { MUser } from '../../../../libs/mongodb/models/users-model';
import type { UserToken } from '../../../../libs/user/user';
import { MTask } from '../../../../libs/mongodb/models/tasks-model';
import { dev } from '$app/environment';
import { Types } from 'mongoose';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {

	const email = url.searchParams.get('email');
	const token = url.searchParams.get('token');

	const task_id = url.searchParams.get('task_id');
	const title = url.searchParams.get('title');
	const description = url.searchParams.get('description');
	const content = url.searchParams.get('content');

	if (!email || !token || !task_id || !title) throw error(400, { message: 'Error 400 : Bad request' });

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

		const task = await MTask.findById(new Types.ObjectId(task_id));

		if (!task) {
			// noinspection JSDeprecatedSymbols
			await mongoServer.close();
			return new Response(JSON.stringify({
				code: 'task/task-does-not-exist',
				message: 'La tâche n\'existe pas.'
			}), {
				status: 406,
				statusText: 'Error 406 : task/task-does-not-exist'
			});
		}

		if (task.owner_uid.toHexString() !== user._id.toHexString()) {
			// noinspection JSDeprecatedSymbols
			await mongoServer.close();
			return new Response(JSON.stringify({
				code: 'task/task-user-does-not-access',
				message: 'L\'utilisateur n\'a pas accès à cette tâche.'
			}), {
				status: 406,
				statusText: 'Error 406 : task/task-user-does-not-access'
			});
		}

		task.title = title;
		task.description = description ?? undefined;
		task.content = content ?? undefined;

		const updated_date = new Date().toISOString();
		task.updated_at = updated_date;

		await task.updateOne({
			title: title,
			description: description,
			content: content,
			updated_at: updated_date
		});

		// noinspection JSDeprecatedSymbols
		await mongoServer.close();

		return new Response(JSON.stringify({
			id: task._id.toHexString(),
			created_at: task.created_at,
			updated_at: updated_date,
			title: title,
			description: description,
			content: content
		}), { status: 200 });
	} catch (e: any) {
		if (dev) console.log(e);
		throw error(500, { message: JSON.stringify(e.message) });
	}
}
