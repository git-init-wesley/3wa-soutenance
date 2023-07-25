<!--suppress HtmlWrongAttributeValue -->
<script lang='ts'>

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import moment from 'moment';
	import { goto } from '$app/navigation';
	import { checkAuth } from '../../../../../../libs/functions/auth-functions';
	import Header from '../../../../../../libs/components/Header.svelte';
	import Preloader from '../../../../../../libs/components/Preloader.svelte';
	import Footer from '../../../../../../libs/components/Footer.svelte';
	import { UserRoles } from '../../../../../../libs/user/user';

	let loading = true;

	let _user = undefined;
	let _email = undefined;
	let _token = undefined;

	let errorMessage;

	let user = undefined;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			_user = await checkAuth($page.url);
			_email = localStorage.getItem('auth_email');
			_token = localStorage.getItem('auth_token');
			//
			const url: URL = new URL(`${$page.url.origin}/api/a/user/read`);
			url.searchParams.set('email', _email ?? '');
			url.searchParams.set('token', _token ?? '');
			url.searchParams.set('user_id', $page.params.id);

			const resp: Response = await fetch(url);
			if (resp.ok) {
				user = await resp.json();
			} else {
				if (resp.status === 406 || resp.status === 403) errorMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
				else errorMessage = resp.statusText;
			}
			loading = false;
		}, 10);
	});

	const onDeleteUser = async (id) => {
		loading = true;
		const url: URL = new URL(`${$page.url.origin}/api/a/user/delete`);
		url.searchParams.set('email', _email ?? '');
		url.searchParams.set('token', _token ?? '');
		url.searchParams.set('user_id', id ?? '');
		const resp: Response = await fetch(url);
		if (resp.ok) {
			await goto(`/a/dash/user`);
		}
		loading = false;
	};

	const onGotoUserEdit = async () => {
		await goto(`/a/dash/user/details/${user.id}/edit`);
	};
</script>

<svelte:head>
	<title>FSD - Tâches (+)</title>
</svelte:head>

<!-- ========================= Preloader Start ========================= -->
{#if loading}
	<Preloader></Preloader>
{/if}
<!-- ========================= Preloader End ========================= -->


<!-- ========================= Header Start ========================= -->
<Header></Header>
<!-- ========================= Header End ========================= -->

<main>
	<section class='bar-link'>
		<article class='forms'>
			<a class='link' href={`/a/dash/user`}><i class='fa-solid fa-arrow-left-long'></i> Retour</a>
		</article>
	</section>

	<!-- ========================= Forms Start ========================= -->
	<section class='forms container'>
		<article>
			<h1>Détails</h1>
			{#if errorMessage}
				<h2 class='error'><i class='fa fa-circle-xmark'></i>{errorMessage}</h2>
			{/if}
		</article>
		<article class='users-informations'>
			<h3>
				{#if user?.role === UserRoles.ADMIN}
					<i class='fa-solid fa-crown primary'></i>
				{/if}
				{user?.email ?? 'N/A'}
				{#if user?.role !== UserRoles.ADMIN}
					<i class='delete fa fa-xmark' on:click={() => onDeleteUser(user?.id)} on:keyup|preventDefault></i>
				{/if}
			</h3>
			<h4>{user?.username ?? 'N/A'}</h4>
		</article>
		<article>
			<h6 class='small-date' style=' margin-top: 1rem'>Dernière mise à jour
				le {moment(new Date(user?.updated_at)).format('DD/MM/YYYY à HH:mm:ss')}</h6>
			<h6 class='small-date'>Compte crée le {moment(new Date(user?.created_at)).format('DD/MM/YYYY à HH:mm:ss')}</h6>
		</article>
	</section>

	<section class='users-edit' on:click={onGotoUserEdit} on:keyup|preventDefault>
		<article>
			<i class='fa fa-pen'></i>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->