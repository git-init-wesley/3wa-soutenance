import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { environmentServer } from '../../../../../environments/environment-server';
import Mongodb from '../../../../../libs/mongodb/mongodb';
import { MTask } from '../../../../../libs/mongodb/models/tasks-model';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	if (!environmentServer.mongoUri) throw error(503, { message: 'Error 503 : MISSING_ENV_295XM' });

	try {
		const mongoServer = new Mongodb(environmentServer.mongoUri, '3wa');
		await mongoServer.init();

		let users = await MTask.count().exec();

		// noinspection JSDeprecatedSymbols
		await mongoServer.close();

		return new Response(JSON.stringify({
			tasks_register: users,
			stats_at: new Date().toISOString()
		}), { status: 200 });
	} catch (e: any) {
		if (dev) console.log(e);
		throw error(500, { message: JSON.stringify(e.message) });
	}
}
