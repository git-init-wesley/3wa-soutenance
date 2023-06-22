<script lang='ts'>

	import { onMount } from 'svelte';
	import Footer from '../../../libs/components/Footer.svelte';
	import Header from '../../../libs/components/Header.svelte';
	import Preloader from '../../../libs/components/Preloader.svelte';
	import { RegexMail, RegexUsername } from '../../../libs/utils/utils';

	// On mount of the page (when the page is loaded)
	onMount(async () => {
		// Define the current year
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		// Remove the preloader
		await setTimeout(() => document.querySelector('.preloader').remove(), 300);
	});

	let username = '';
	let usernameTouch = false;
	let email = '';
	let emailTouch = false;
	let password = '';
	let passwordTouch = false;
	let confirmPassword = '';
	let confirmPasswordTouch = false;

	let rgpd = false;
</script>

<svelte:head>
	<title>FSD - Auth/Inscription</title>
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
			<h1>Inscription</h1>
			<form action='login' method='post'>
				<section>
					<article>
						<label for='username'><i class='fa fa-tag prep-start'></i>Pseudonyme</label>
						<input bind:value={username} id='username' name='username' on:change={() => {usernameTouch = true}} required
									 type='text' />
						{#if usernameTouch}
							<p class='wrong' show={!RegexUsername.test(username)}>
								<i class='fa fa-circle-exclamation'></i>Pseudonyme incorrecte
							</p>
						{/if}
					</article>
				</section>
				<section>
					<article>
						<label for='email'><i class='fa fa-envelope prep-start'></i>Email</label>
						<input bind:value={email} id='email' name='email' on:change={() => {emailTouch = true}} required
									 type='email' />
						{#if emailTouch}
							<p class='wrong' show={!RegexMail.test(email)}>
								<i class='fa fa-circle-exclamation'></i>Adresse mail incorrecte
							</p>
						{/if}
					</article>
				</section>
				<section>
					<article>
						<label for='password'><i class='fa fa-lock prep-start'></i>Mot de passe</label>
						<input bind:value={password} id='password' name='password' on:change={() => {passwordTouch = true}} required
									 type='password' />
					</article>
				</section>
				<section>
					<article>
						<label for='confirm_password'><i class='fa fa-lock prep-start'></i>Confirmation du Mot de passe</label>
						<input bind:value={confirmPassword} id='confirm_password' name='password'
									 on:change={() => {confirmPasswordTouch = true}} required type='password' />
					</article>
				</section>
				<section>
					<article>
						<label for='rgpd'>
							<input bind:checked={rgpd} id='rgpd' name='rgpd' type='checkbox' />
							J'accepte les <a class='missing' href='/rgpd' style='font-size: 0.8rem'>conditions d'utilisation</a>
						</label>
					</article>
				</section>
				<button type='submit'>S'inscrire</button>
				<a class='link' href='/auth/sign-in'>Vous avez déjà un compte ?</a>
			</form>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->
