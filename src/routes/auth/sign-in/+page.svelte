<script lang='ts'>

	import { onMount } from 'svelte';
	import Footer from '../../../libs/components/Footer.svelte';
	import Header from '../../../libs/components/Header.svelte';
	import Preloader from '../../../libs/components/Preloader.svelte';

	// On mount of the page (when the page is loaded)
	onMount(async () => {
		// Define the current year
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		// Remove the preloader
		await setTimeout(() => document.querySelector('.preloader').remove(), 300);
	});

	let email = '';
	let password = '';
	let remember = false;
</script>

<svelte:head>
	<title>FSD - Auth/Connexion</title>
</svelte:head>

<!-- ========================= Preloader Start ========================= -->
<Preloader></Preloader>
<!-- ========================= Preloader End ========================= -->


<!-- ========================= Header Start ========================= -->
<Header></Header>
<!-- ========================= Header End ========================= -->

<main>
	<!-- ========================= Forms Start ========================= -->
	<section class='forms container'>
		<article>
			<img alt='3WA - Logo' height='144' src='/icons/3wa.png' width='130' />
			<h1>Connexion</h1>
			<form action='login' method='post'>
				<section>
					<article>
						<label for='email'><i class='fa fa-envelope prep-start'></i>Email</label>
						<input bind:value={email} id='email' name='email' required type='email' />
					</article>
				</section>
				<section>
					<article>
						<label for='password'><i class='fa fa-lock prep-start'></i>Mot de passe</label>
						<input bind:value={password} id='password' name='password' required type='password' />
						<a class='missing' href='/auth/recovery'>Mot de passe oublié ?</a>
					</article>
				</section>
				<section>
					<article>
						<label for='remember'>
							<input bind:checked={remember} id='remember' name='remember' type='checkbox' />Se souvenir de moi
						</label>
					</article>
				</section>
				<button type='submit'>Se connecter</button>
				<a class='link' href='/auth/sign-up'>Vous n'avez pas de compte ?</a>
			</form>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->
