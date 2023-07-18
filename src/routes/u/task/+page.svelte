<script lang='ts'>
	import Preloader from '../../../libs/components/Preloader.svelte';
	import Header from '../../../libs/components/Header.svelte';
	import Footer from '../../../libs/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { checkAuth } from '../../../libs/functions/auth-functions';
	import { page } from '$app/stores';

	let loading = true;
	let user = undefined;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
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

	<section class='tasks-table'>
		<article class='table-header'>
			<form>
				<section>
					<article>
						SearchInput
					</article>
				</section>
				<section>
					<article>
						Button
					</article>
				</section>
			</form>
		</article>
		<article class='table-items'>

		</article>
	</section>

</main>


<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->