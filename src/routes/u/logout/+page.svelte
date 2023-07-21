<script lang='ts'>
	import Preloader from '../../../libs/components/Preloader.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	onMount(async () => {
		const email = localStorage.getItem('_email');
		const token = localStorage.getItem('_token');

		if (email && token) {
			const url: URL = new URL(`${$page.url.origin}/api/auth/sign-in/token/delete`);
			url.searchParams.set('email', email);
			url.searchParams.set('token', token);
			await fetch(url);
		}

		localStorage.removeItem('_token');
		localStorage.removeItem('_email');

		await goto('/').then();
	});

</script>

<svelte:head>
	<title>FSD - Auth/Déconnexion</title>
</svelte:head>

<!-- ========================= Preloader Start ========================= -->
<Preloader></Preloader>
<!-- ========================= Preloader End ========================= -->