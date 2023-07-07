<script lang='ts'>

	import { onMount } from 'svelte';
	import Footer from '../../../libs/components/Footer.svelte';
	import Header from '../../../libs/components/Header.svelte';
	import Preloader from '../../../libs/components/Preloader.svelte';
	import { page } from '$app/stores';
	import { checkAuth } from '../../../libs/functions/auth-functions';

	let loading = true;
	let errorMessage = undefined;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			await checkAuth($page.url);
			loading = false;
		}, 300);
	});

</script>

<!-- ========================= Preloader Start ========================= -->
{#if loading}
	<Preloader></Preloader>
{/if}
<!-- ========================= Preloader End ========================= -->


<!-- ========================= Header Start ========================= -->
<Header></Header>
<!-- ========================= Header End ========================= -->

<main>
	<p>Profil</p>
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->