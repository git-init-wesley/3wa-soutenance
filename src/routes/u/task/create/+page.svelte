<!--suppress HtmlWrongAttributeValue -->
<script lang='ts'>

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { checkAuth } from '../../../../libs/functions/auth-functions';
	import Footer from '../../../../libs/components/footer/Footer.svelte';
	import Preloader from '../../../../libs/components/preloader/Preloader.svelte';
	import Header from '../../../../libs/components/header/Header.svelte';
	import { goto } from '$app/navigation';

	let loading = true;

	let user = undefined;
	let auth_email = undefined;
	let auth_token = undefined;

	let errorMessage;

	let title;
	let description;
	let content;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
			auth_email = localStorage.getItem('auth_email');
			auth_token = localStorage.getItem('auth_token');
			loading = false;
		}, 10);
	});


	const onSubmit = async (_: Event) => {
		loading = true;

		let validate = true;

		if (title === '' || title == undefined) validate = false;

		if (validate) {
			const url: URL = new URL(`${$page.url.origin}/api/task/create`);
			url.searchParams.set('email', auth_email ?? '');
			url.searchParams.set('token', auth_token ?? '');
			url.searchParams.set('title', title);
			if (description) url.searchParams.set('description', description);
			if (content) url.searchParams.set('content', content);
			const resp: Response = await fetch(url);
			if (resp.ok)
				await goto('/u/task');
			else {
				if (resp.status === 406 || resp.status === 403) errorMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
				else errorMessage = resp.statusText;
			}
		}

		loading = false;
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

<main loading={loading ? 'loading' : undefined}>

	<section class='bar-link'>
		<article class='forms'>
			<a class='link' href={`/u/task/`}><i class='fa-solid fa-arrow-left-long'></i> Retour</a>
		</article>
	</section>

	<!-- ========================= Forms Start ========================= -->
	<section class='forms container'>
		<article>
			<img alt='3WA - Logo' height='144' src='/icons/3wa.png' width='130' />
			<h1>Ajout d'une Tâche</h1>
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
						<input bind:value={description} id='description' name='description'
									 type='text' />
					</article>
				</section>
				<section>
					<article>
						<label for='content'><i class='fa-solid fa-bookmark prep-start'></i>Contenue de la tâche</label>
						<textarea bind:value={content} id='content' name='content' rows='10'></textarea>
					</article>
				</section>
				<button type='submit'>Ajouter</button>
			</form>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->
