import { goto } from '$app/navigation';
import type { UserToken } from '../user/user';
import { UserRoles } from '../user/user';

export const checkAuth = async ($url: URL) => {
	const auth_token = localStorage.getItem('auth_token');
	const auth_mail = localStorage.getItem('auth_email');
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
	} else if ($url.pathname.startsWith?.('/a')) {
		if (!resp.ok) {
			await goto('/');
			return undefined;
		} else {
			const response = (await resp.json()) as { username: string, role: string, tokens: UserToken[], token: string };
			if (response.role !== UserRoles.ADMIN) {
				await goto('/');
				return undefined;
			} else {
				return response;
			}
		}
	}

	if (!resp.ok) return undefined;
	else return (await resp.json()) as { username: string, role: string, tokens: UserToken[], token: string };
};