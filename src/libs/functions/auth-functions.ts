import { goto } from '$app/navigation';

export const checkAuth = async ($url: URL) => {
	const auth_token = localStorage.getItem('auth_token');
	const auth_mail = localStorage.getItem('auth_mail');
	if ($url.pathname.startsWith?.('/api') === true) return false;

	const url: URL = new URL(`${$url.origin}/api/auth/sign-in/token`);
	url.searchParams.set('email', auth_mail ?? '');
	url.searchParams.set('token', auth_token ?? '');
	const resp: Response = await fetch(url);

	if ($url.pathname.startsWith?.('/auth') === true) {
		if (resp.ok) return goto('/');
	} else if ($url.pathname.startsWith?.('/u')) {
		if (!resp.ok) return goto('/');
	}

	return resp.ok;
};