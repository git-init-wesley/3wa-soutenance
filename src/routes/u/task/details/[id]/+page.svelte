<!--suppress HtmlWrongAttributeValue -->
<script lang='ts'>

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { checkAuth } from '../../../../../libs/functions/auth-functions';
	import Footer from '../../../../../libs/components/Footer.svelte';
	import Preloader from '../../../../../libs/components/Preloader.svelte';
	import Header from '../../../../../libs/components/Header.svelte';
	import moment from 'moment';
	import { goto } from '$app/navigation';

	let loading = true;

	let user = undefined;
	let _email = undefined;
	let _token = undefined;

	let errorMessage;

	let task = undefined;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
			_email = localStorage.getItem('_email');
			_token = localStorage.getItem('_token');
			//
			const url: URL = new URL(`${$page.url.origin}/api/task/read`);
			url.searchParams.set('email', _email ?? '');
			url.searchParams.set('token', _token ?? '');
			url.searchParams.set('task_id', $page.params.id);

			const resp: Response = await fetch(url);
			if (resp.ok) {
				task = await resp.json();
			} else {
				if (resp.status === 406 || resp.status === 403) errorMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
				else errorMessage = resp.statusText;
			}
			loading = false;
		}, 10);
	});

	const onGotoTaskEdit = async () => {
		await goto(`/u/task/details/${task.id}/edit`);
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
	<section>
		<article class='forms'>
			<a class='link' href={`/u/task`}><i class='fa-solid fa-arrow-left-long'></i> Retour</a>
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
		<article class='tasks-informations'>
			<h3>{task?.title ?? 'N/A'}</h3>

			{#if task?.description}
				<h4>{task?.description ?? 'N/A'}</h4>
			{/if}

			{#if task?.content}
				<p>{task.content}</p>
			{/if}
		</article>
		<article>
			<h6 class='small-date' style=' margin-top: 1rem'>Dernière mise à jour
				le {moment(new Date(task?.updated_at)).format('DD/MM/YYYY à HH:mm:ss')}</h6>
			<h6 class='small-date'>Tâche crée le {moment(new Date(task?.created_at)).format('DD/MM/YYYY à HH:mm:ss')}</h6>
		</article>
	</section>

	<section class='tasks-edit' on:click={onGotoTaskEdit} on:keyup|preventDefault>
		<article>
			<i class='fa fa-pen'></i>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->