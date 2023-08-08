<!--suppress HtmlWrongAttributeValue -->
<script lang='ts'>

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import moment from 'moment';
	import { goto } from '$app/navigation';
	import { checkAuth } from '../../../../../../libs/functions/auth-functions';
	import Header from '../../../../../../libs/components/header/Header.svelte';
	import Preloader from '../../../../../../libs/components/preloader/Preloader.svelte';
	import Footer from '../../../../../../libs/components/footer/Footer.svelte';
	import { UserRoles } from '../../../../../../libs/user/user';

	let loading = true;

	let user = undefined;
	let auth_email = undefined;
	let auth_token = undefined;

	let errorMessage;

	let findUser = undefined;
	let tasks_count = undefined;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
			auth_email = localStorage.getItem('auth_email');
			auth_token = localStorage.getItem('auth_token');

			const url: URL = new URL(`${$page.url.origin}/api/a/user/read`);
			url.searchParams.set('email', auth_email ?? '');
			url.searchParams.set('token', auth_token ?? '');
			url.searchParams.set('user_id', $page.params.id);

			const resp: Response = await fetch(url);

			if (resp.ok) {
				findUser = await resp.json();

				const url2: URL = new URL(`${$page.url.origin}/api/a/stats/tasks/user`);
				url2.searchParams.set('email', auth_email ?? '');
				url2.searchParams.set('token', auth_token ?? '');
				url2.searchParams.set('user_id', findUser.id);

				const resp2: Response = await fetch(url2);
				tasks_count = (await resp2.json())?.tasks_by_user_count ?? 0;

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
		url.searchParams.set('email', auth_email ?? '');
		url.searchParams.set('token', auth_token ?? '');
		url.searchParams.set('user_id', id ?? '');
		const resp: Response = await fetch(url);
		if (resp.ok) {
			await goto(`/a/dash/user`);
		}
		loading = false;
	};

	const onGotoUserEdit = async () => await goto(`/a/dash/user/details/${findUser.id}/edit`);
</script>

<svelte:head>
	<title>FSD - Dash - Users - Détails</title>
</svelte:head>

<!-- ========================= Preloader Start ========================= -->
{#if loading}
	<Preloader></Preloader>
{/if}
<!-- ========================= Preloader End ========================= -->


<!-- ========================= Header Start ========================= -->
<Header></Header>
<!-- ========================= Header End ========================= -->

<main loading={loading ? 'loading' : undefined}>
	<section class='bar-link'>
		<article class='forms'>
			<a class='link' href={`/a/dash/user`}><i class='fa-solid fa-arrow-left-long'></i> Retour</a>
		</article>
	</section>

	<!-- ========================= Forms Start ========================= -->
	<section class='forms container'>
		<article>
			<h1>Détails <i class='fa-solid fa-bars-staggered'></i></h1>
			{#if errorMessage}
				<h2 class='error'><i class='fa fa-circle-xmark'></i>{errorMessage}</h2>
			{/if}
			<form class='forms' on:submit|preventDefault>
				<button on:click={onGotoUserEdit}>
					Modifier l'utilisateur <i class='fa fa-pen'></i>
				</button>
			</form>
		</article>
		<article class='users-informations'>
			<h3>
				{#if findUser?.role === UserRoles.ADMIN}
					<i class='fa-solid fa-crown primary'></i>
				{/if}
				{findUser?.username ?? 'N/A'}
				{#if findUser?.role !== UserRoles.ADMIN}
					<i class='delete fa fa-xmark' on:click={() => onDeleteUser(findUser?.id)} on:keyup|preventDefault></i>
				{/if}
			</h3>
			<h4>{findUser?.email ?? 'N/A'}</h4>
			<h5>Tâche{tasks_count > 1 ? 's' : ''} : <span
				class={tasks_count ? 'success' : 'primary'}>{tasks_count ?? 'Chargement'}</span></h5>
		</article>
		<article>
			<h6 class='small-date' style=' margin-top: 1rem'>Dernière mise à jour
				le {moment(new Date(findUser?.updated_at)).format('DD/MM/YYYY à HH:mm:ss')}</h6>
			<h6 class='small-date'>Compte crée
				le {moment(new Date(findUser?.created_at)).format('DD/MM/YYYY à HH:mm:ss')}</h6>
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