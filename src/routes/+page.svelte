<script lang='ts'>
	import Header from '../libs/components/Header.svelte';
	import Footer from '../libs/components/Footer.svelte';
	import Preloader from '../libs/components/Preloader.svelte';
	import { onMount } from 'svelte';

	// On mount of the page (when the page is loaded)
	onMount(async () => {
		// Define the current year
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		// Remove the preloader
		await setTimeout(() => document.querySelector('.preloader').remove(), 10);
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
	</section>
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->

