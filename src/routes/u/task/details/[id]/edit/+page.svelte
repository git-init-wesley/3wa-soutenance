<!--suppress HtmlWrongAttributeValue -->
<script lang='ts'>

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { checkAuth } from '../../../../../../libs/functions/auth-functions';
	import Footer from '../../../../../../libs/components/Footer.svelte';
	import Preloader from '../../../../../../libs/components/Preloader.svelte';
	import Header from '../../../../../../libs/components/Header.svelte';
	import { goto } from '$app/navigation';
	import moment from 'moment/moment';

	let loading = true;

	let user = undefined;
	let _email = undefined;
	let _token = undefined;

	let errorMessage;

	let task = undefined;
	let title;
	let description;
	let content;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
			_email = localStorage.getItem('auth_email');
			_token = localStorage.getItem('auth_token');
			//
			const url: URL = new URL(`${$page.url.origin}/api/task/read`);
			url.searchParams.set('email', _email ?? '');
			url.searchParams.set('token', _token ?? '');
			url.searchParams.set('task_id', $page.params.id);

			const resp: Response = await fetch(url);
			if (resp.ok) {
				task = await resp.json();
				title = task.title;
				description = task.description;
				content = task.content;
			} else {
				if (resp.status === 406 || resp.status === 403) errorMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
				else errorMessage = resp.statusText;
			}
			loading = false;
		}, 10);
	});


	const onSubmit = async (_: Event) => {
		loading = true;

		let validate = true;

		if (title === '' || title == undefined) validate = false;
		if (!(title !== task?.title || description !== task?.description || content !== task?.content)) validate = false;

		if (validate) {
			const url: URL = new URL(`${$page.url.origin}/api/task/update`);
			url.searchParams.set('email', _email ?? '');
			url.searchParams.set('token', _token ?? '');
			url.searchParams.set('task_id', task?.id);
			url.searchParams.set('title', title);
			if (description) url.searchParams.set('description', description);
			if (content) url.searchParams.set('content', content);
			const resp: Response = await fetch(url);
			if (resp.ok)
				await goto(`/u/task/details/${task.id}`);
			else {
				if (resp.status === 406 || resp.status === 403) errorMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
				else errorMessage = resp.statusText;
			}
		}

		loading = false;
	};

	const onGotoTaskCancel = async () => {
		await goto(`/u/task/details/${task.id}`);
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
			<a class='link' href={`/u/task/details/${task?.id}`}><i class='fa-solid fa-arrow-left-long'></i> Retour</a>
		</article>
	</section>

	<!-- ========================= Forms Start ========================= -->
	<section class='forms container'>
		<article>
			<h1>Modification</h1>
			{#if errorMessage}
				<h2 class='error'><i class='fa fa-circle-xmark'></i>{errorMessage}</h2>
			{/if}
			<form on:submit|preventDefault={onSubmit}>
				<section>
					<article>
						<label for='title'><i class='fa fa-tag prep-start'></i>Titre</label>
						<input bind:value={title} id='title' name='title' required
									 type='text' />
					</article>
				</section>
				<section>
					<article>
						<label for='description'><i class='fa-solid fa-bars-staggered prep-start'></i>Description</label>
						<input bind:value={description} id='description' name='description' type='text' />
					</article>
				</section>
				<section>
					<article>
						<label for='content'><i class='fa-solid fa-bookmark prep-start'></i>Contenue de la tâche</label>
						<textarea bind:value={content} id='content' name='content'></textarea>
					</article>
				</section>
				<button
					disabled={title !== task?.title || description !== task?.description || content !== task?.content ? undefined : 'disabled'}
					type='submit'>
					Enregistrer
				</button>
			</form>
			<h6 class='small-date'>Dernière mise à jour
				le {moment(new Date(task?.updated_at)).format('DD/MM/YYYY à HH:mm:ss')}</h6>
			<h6 class='small-date'>Tâche crée le {moment(new Date(task?.created_at)).format('DD/MM/YYYY à HH:mm:ss')}</h6>
		</article>
	</section>

	<section class='tasks-edit' on:click={onGotoTaskCancel} on:keyup|preventDefault>
		<article>
			<i class='fa fa-xmark'></i>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->