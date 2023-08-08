<script lang='ts'>
	import { onMount } from 'svelte';
	import Preloader from '../../../libs/components/preloader/Preloader.svelte';
	import Header from '../../../libs/components/header/Header.svelte';
	import Footer from '../../../libs/components/footer/Footer.svelte';
	import { goto } from '$app/navigation';

	let loading = true;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			loading = false;
		}, 10);
	});

	const onGotoUser = async () => await goto('/a/dash/user');
</script>

<svelte:head>
	<title>FSD - Dashboard</title>
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
	<section class='container'>
		<article>
			<h1>Dashboard <i class='fa-solid fa-hammer'></i></h1>
		</article>
		<article class='forms dash-buttons'>
			<button on:click={onGotoUser}>Utilisateurs <i class='fa fa-user'></i></button>
			<button disabled>Statistiques avancées <i class='fa-solid fa-arrow-trend-up'></i></button>
		</article>
	</section>
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->

