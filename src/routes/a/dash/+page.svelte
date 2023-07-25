<script lang='ts'>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Preloader from '../../../libs/components/Preloader.svelte';
	import Header from '../../../libs/components/Header.svelte';
	import Footer from '../../../libs/components/Footer.svelte';
	import { goto } from '$app/navigation';

	let users_admin = 0;
	let users_register = 0;
	let tasks_register = 0;

	// On mount of the page (when the page is loaded)
	onMount(async () => {
		// Define the current year
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		// Remove the preloader
		await setTimeout(async () => {
			document.querySelector('.preloader').remove();
			users_admin = (await (await fetch(`${$page.url.origin}/api/stats/users/admin`)).json())?.users_admin ?? 0;
			users_register = (await (await fetch(`${$page.url.origin}/api/stats/users/register`)).json())?.users_register ?? 0;
			tasks_register = (await (await fetch(`${$page.url.origin}/api/stats/tasks/register`)).json())?.tasks_register ?? 0;
		}, 10);
	});

	const onGotoUser = async () => {
		await goto('/a/dash/user');
	};
</script>

<svelte:head>
	<title>FSD - Dashboard</title>
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
			<h1>Dashboard <i class='fa-solid fa-hammer'></i></h1>
		</article>
		<article class='forms dash-buttons'>
			<button on:click={onGotoUser}>Utilisateurs <i class='fa fa-user'></i></button>
			<button>Statistiques avancées <i class='fa-solid fa-arrow-trend-up'></i></button>
		</article>
	</section>
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->

