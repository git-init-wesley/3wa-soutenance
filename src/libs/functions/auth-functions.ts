import { goto } from '$app/navigation';
import type { UserToken } from '../user/user';

export const checkAuth = async ($url: URL) => {
	const auth_token = localStorage.getItem('_token');
	const auth_mail = localStorage.getItem('_email');
	if ($url.pathname.startsWith?.('/api') === true) return undefined;

	const url: URL = new URL(`${$url.origin}/api/auth/sign-in/token`);
	url.searchParams.set('email', auth_mail ?? '');
	url.searchParams.set('token', auth_token ?? '');
	const resp: Response = await fetch(url);

	if ($url.pathname.startsWith?.('/auth') === true) {
		if (resp.ok) {
			await goto('/');
			return undefined;
		}
	} else if ($url.pathname.startsWith?.('/u')) {
		if (!resp.ok) {
			await goto('/');
			return undefined;
		}
	}

	if (!resp.ok) return undefined;
	else return (await resp.json()) as { username: string, role: string, tokens: UserToken[], token: string };
};