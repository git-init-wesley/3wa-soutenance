<script lang='ts'>
	import Preloader from '../../../libs/components/Preloader.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(async () => {
		const email = localStorage.getItem('auth_email');
		const token = localStorage.getItem('auth_token');

		if (email && token) {
			const url: URL = new URL(`${$page.url.origin}/api/auth/sign-in/token/delete`);
			url.searchParams.set('email', email);
			url.searchParams.set('token', token);
			await fetch(url);
		}

		localStorage.removeItem('auth_token');
		localStorage.removeItem('auth_email');

		await goto('/').then();
	});

</script>

<svelte:head>
	<title>FSD - Auth/Déconnexion</title>
</svelte:head>

<!-- ========================= Preloader Start ========================= -->
<Preloader></Preloader>
<!-- ========================= Preloader End ========================= -->