<script lang='ts'>
	import Header from '../libs/components/Header.svelte';
	import Footer from '../libs/components/Footer.svelte';
	import Preloader from '../libs/components/Preloader.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let users_admin = undefined;
	let users_register = undefined;
	let tasks_register = undefined;

	// On mount of the page (when the page is loaded)
	onMount(async () => {
		// Define the current year
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		// Remove the preloader
		document.querySelector('.preloader').remove();
		setTimeout(async () => users_admin = (await (await fetch(`${$page.url.origin}/api/stats/users/admin`)).json())?.users_admin ?? 0, 0);
		setTimeout(async () => users_register = (await (await fetch(`${$page.url.origin}/api/stats/users/register`)).json())?.users_register ?? 0, 0);
		setTimeout(async () => tasks_register = (await (await fetch(`${$page.url.origin}/api/stats/tasks/register`)).json())?.tasks_register ?? 0, 0);
	});
</script>

<svelte:head>
	<title>FSD - Accueil</title>
</svelte:head>

<!-- ========================= Preloader Start ========================= -->
<Preloader></Preloader>
<!-- ========================= Preloader End ========================= -->


<!-- ========================= Header Start ========================= -->
<Header></Header>
<!-- ========================= Header End ========================= -->

<main>
	<section class='container'>
		<article>
			<img alt='3WA - Logo' height='144' src='/icons/3wa.png' width='130' />
			<h1>Accueil</h1>
		</article>
		<article class='stats'>
			{#if users_admin === undefined}
				<p>Administrateur : <span class='spinner'>•</span></p>
			{:else }
				<p>Administrateur{users_admin > 1 ? 's' : ''} : <span class='success'>{users_admin}</span></p>
			{/if}
			{#if users_register === undefined}
				<p>Utilisateur enregistré : <span class='spinner'>•</span></p>
			{:else}
				<p>Utilisateur enregistré : <span class='success'>{users_register}</span></p>
			{/if}

			{#if tasks_register === undefined}
				<p>Tâche enregistrée : <span class='spinner'>•</span></p>
			{:else}
				<p>Tâche enregistrée : <span class='success'>{tasks_register}</span></p>
			{/if}
		</article>
	</section>
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->

