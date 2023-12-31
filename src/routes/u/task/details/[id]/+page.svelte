<!--suppress HtmlWrongAttributeValue -->
<script lang='ts'>

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { checkAuth } from '../../../../../libs/functions/auth-functions';
	import Footer from '../../../../../libs/components/footer/Footer.svelte';
	import Preloader from '../../../../../libs/components/preloader/Preloader.svelte';
	import Header from '../../../../../libs/components/header/Header.svelte';
	import moment from 'moment';
	import { goto } from '$app/navigation';

	let loading = true;

	let user = undefined;
	let auth_email = undefined;
	let auth_token = undefined;

	let errorMessage;

	let task = undefined;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
			auth_email = localStorage.getItem('auth_email');
			auth_token = localStorage.getItem('auth_token');
			const url: URL = new URL(`${$page.url.origin}/api/task/read`);
			url.searchParams.set('email', auth_email ?? '');
			url.searchParams.set('token', auth_token ?? '');
			url.searchParams.set('task_id', $page.params.id);

			const resp: Response = await fetch(url);
			if (resp.ok) task = await resp.json();
			else {
				if (resp.status === 406 || resp.status === 403) errorMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
				else errorMessage = resp.statusText;
			}
			loading = false;
		}, 10);
	});

	const onDeleteTask = async (id) => {
		loading = true;
		const url: URL = new URL(`${$page.url.origin}/api/task/delete`);
		url.searchParams.set('email', auth_email ?? '');
		url.searchParams.set('token', auth_token ?? '');
		url.searchParams.set('task_id', id ?? '');
		const resp: Response = await fetch(url);
		if (resp.ok) await goto(`/u/task/`);
		loading = false;
	};

	const onUpdateTask = async (task) => {
		loading = true;
		const url: URL = new URL(`${$page.url.origin}/api/task/update`);
		url.searchParams.set('email', auth_email ?? '');
		url.searchParams.set('token', auth_token ?? '');
		url.searchParams.set('task_id', task?.id);
		url.searchParams.set('title', task.title);
		url.searchParams.set('finished', String(!task.finished));
		if (task.description) url.searchParams.set('description', task.description);
		if (task.content) url.searchParams.set('content', task.content);
		const resp: Response = await fetch(url);
		loading = false;
	};

	const onGotoTaskEdit = async () => await goto(`/u/task/details/${task.id}/edit`);
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

<main loading={loading ? 'loading' : undefined}>
	<section class='bar-link'>
		<article class='forms'>
			<a class='link' href={`/u/task`}><i class='fa-solid fa-arrow-left-long'></i> Retour</a>
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
				<button on:click={onGotoTaskEdit}>
					Modifier la tâche <i class='fa fa-pen'></i>
				</button>
			</form>
		</article>
		<article class='tasks-informations'>
			<h3>
				{#if task}
					<input bind:checked={task.finished} on:click={()  => onUpdateTask(task)} type='checkbox' />
				{/if}
				{task?.title ?? 'N/A'} <i class='delete fa fa-trash' on:click={() => onDeleteTask(task?.id)}
																	on:keyup|preventDefault></i>
			</h3>
			{#if task?.description}
				<h4>{task?.description ?? 'N/A'}</h4>
			{/if}

			{#if task?.content}
				<pre>{task.content}</pre>
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