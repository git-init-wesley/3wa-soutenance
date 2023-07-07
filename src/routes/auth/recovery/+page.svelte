<script lang='ts'>

	import { onMount } from 'svelte';
	import Footer from '../../../libs/components/Footer.svelte';
	import Header from '../../../libs/components/Header.svelte';
	import Preloader from '../../../libs/components/Preloader.svelte';
	import { RegexMail } from '../../../libs/utils/utils';
	import { checkAuth } from '../../../libs/functions/auth-functions';
	import { page } from '$app/stores';

	let loading = true;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			await checkAuth($page.url);
			loading = false;
		}, 300);
	});

	let email = '';
	let emailTouch = false;
</script>

<svelte:head>
	<title>FSD - Auth/Récupération</title>
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
	<!-- ========================= Forms Start ========================= -->
	<section class='forms container'>
		<article>
			<img alt='3WA - Logo' height='144' src='/icons/3wa.png' width='130' />
			<h1>Récupération</h1>
			<h2 class='unavailable'>Service momentanément indisponible</h2>
			<form action='login' method='post'>
				<section>
					<article>
						<label for='email'><i class='fa fa-envelope prep-start'></i>Email</label>
						<input bind:value={email} id='email' name='email' on:focusout={() => {emailTouch = true}}
									 placeholder='test@example.fr' required
									 type='email' />
						{#if emailTouch}
							<p class='wrong' show={!RegexMail.test(email)}>
								<i class='fa fa-circle-exclamation'></i>Adresse mail incorrecte
							</p>
						{/if}
					</article>
				</section>
				<button disabled='disabled' type='submit'>Récupérer</button>
				<a class='link' href='/auth/sign-in'>Vous vous souvenez de votre mot de passe ?</a>
			</form>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->
