<script lang='ts'>
	import Header from '../../libs/components/header/Header.svelte';
	import Footer from '../../libs/components/footer/Footer.svelte';
	import Preloader from '../../libs/components/preloader/Preloader.svelte';
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
	<title>FSD - RGPD</title>
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
			<h1>Clause de non-responsabilité</h1>
			<p>
				Ce site est fictif/non contractuel, il a pour unique objectif la présentation d'une soutenance
				pour le projet de fin d'année dans le cadre de la formation FSD.
			</p>
		</article>
	</section>
</main>


<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->

