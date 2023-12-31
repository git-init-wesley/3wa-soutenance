<script lang='ts'>

	import { onMount } from 'svelte';
	import Footer from '../../../libs/components/footer/Footer.svelte';
	import Header from '../../../libs/components/header/Header.svelte';
	import Preloader from '../../../libs/components/preloader/Preloader.svelte';
	import {
		RegexMail,
		RegexPassword,
		RegexSpecialCharacters,
		RegexTo_09,
		RegexTo_3_16,
		RegexTo_8_32,
		RegexTo_AZ,
		RegexTo_az,
		RegexUsername
	} from '../../../libs/utils/utils';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { checkAuth } from '../../../libs/functions/auth-functions';

	let loading = true;
	let errorMessage = undefined;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			await checkAuth($page.url);
			loading = false;
		}, 10);
	});

	let username = '';
	let usernameTouch = false;
	let usernameTooltips = false;
	let email = '';
	let emailTouch = false;
	let password = '';
	let passwordTouch = false;
	let passwordTooltips = false;
	let confirmPassword = '';
	let confirmPasswordTouch = false;

	let rgpd = false;
	let rgpdTouch = false;

	const onSubmit = async (_: Event) => {
		loading = true;
		errorMessage = undefined;
		usernameTouch = true;
		emailTouch = true;
		passwordTouch = true;
		confirmPasswordTouch = true;
		rgpdTouch = true;

		let validate = true;
		if (!RegexUsername.test(username)) validate = false;
		if (!RegexMail.test(email)) validate = false;
		if (!RegexPassword.test(password)) validate = false;
		if (password !== confirmPassword) validate = false;
		if (!rgpd) validate = false;

		if (!validate) {
			loading = false;
			return;
		}

		const url: URL = new URL(`${$page.url.origin}/api/auth/sign-up`);
		url.searchParams.set('username', username);
		url.searchParams.set('email', email);
		url.searchParams.set('password', password);
		const resp: Response = await fetch(url);
		if (!resp.ok) {
			if (resp.status === 406)
				errorMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
			else
				errorMessage = resp.statusText;

			loading = false;
			return;
		}

		const token: string | null | undefined = (await resp.json()).token;
		if (!token) {
			errorMessage = 'Erreur inconnue.';
			throw Error('Token don\'t received.');
		}
		localStorage.setItem('auth_token', token);
		localStorage.setItem('auth_email', email);

		//TODO: Redirect
		await goto('/');

		loading = false;
	};
</script>

<svelte:head>
	<title>FSD - Auth/Inscription</title>
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
	<!-- ========================= Forms Start ========================= -->
	<section class='forms container'>
		<article>
			<img alt='3WA - Logo' height='144' src='/icons/3wa.png' width='130' />
			<h1>Inscription <i class='fa-solid fa-user-plus'></i></h1>
			{#if errorMessage}
				<h2 class='error'><i class='fa fa-circle-xmark'></i>{errorMessage}</h2>
			{/if}
			<form on:submit|preventDefault={onSubmit}>
				<section>
					<article>
						<label for='username'><i class='fa fa-tag prep-start'></i>Pseudonyme</label>
						<input bind:value={username} id='username' name='username'
									 on:focusin={() => {usernameTooltips = true}}
									 on:focusout={() => {usernameTouch = true; usernameTooltips = false }}
									 placeholder='Pseudonyme' required
									 type='text' />
						{#if usernameTouch}
							<p class='wrong' show={!RegexUsername.test(username)}>
								<i class='fa fa-circle-exclamation'></i>Pseudonyme incorrecte
							</p>
						{/if}
					</article>
					<article class='tooltips' show={usernameTooltips}>
						<p>
							<i class='fa fa-circle-minus info'></i>
							Peut inclure des chiffres.
						</p>
						<p>
							<i class='fa fa-circle-minus info'></i>
							Peut inclure des minuscules ou majuscules.
						</p>
						<p>
							<i
								class={!RegexSpecialCharacters.test(username) ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Ne doit pas contenir de caractère special sauf « ._ ».
						</p>
						<p>
							<i class={RegexTo_3_16.test(username) ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins 3 caractères, mais pas plus de 16.
						</p>
					</article>
				</section>
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
				<section>
					<article>
						<label for='password'><i class='fa fa-lock prep-start'></i>Mot de passe</label>
						<input bind:value={password} id='password' name='password'
									 on:focusin={() => {passwordTooltips = true}}
									 on:focusout={() => {passwordTouch = true; passwordTooltips = false }}
									 placeholder='••••••••' required
									 type='password' />
						{#if passwordTouch}
							<p class='wrong' show={!RegexPassword.test(password)}>
								<i class='fa fa-circle-exclamation'></i>Mot de passe incorrecte
							</p>
						{/if}
					</article>
					<article class='tooltips' show={passwordTooltips}>
						<p>
							<i class={RegexTo_09.test(password) ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins un chiffre.
						</p>
						<p>
							<i class={RegexTo_az.test(password) ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins une minuscule.
						</p>
						<p>
							<i class={RegexTo_AZ.test(password) ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins une majuscule.
						</p>
						<p>
							<i
								class={RegexSpecialCharacters.test(password) ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins un caractère spécial.
						</p>
						<p>
							<i class={RegexTo_8_32.test(password) ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins 8 caractères, mais pas plus de 32.
						</p>
					</article>
				</section>
				<section>
					<article>
						<label for='confirm_password'><i class='fa fa-lock prep-start'></i>Confirmation du Mot de passe</label>
						<input bind:value={confirmPassword} id='confirm_password' name='password'
									 on:focusout={() => {confirmPasswordTouch = true}}
									 placeholder='••••••••' required type='password' />
						{#if confirmPasswordTouch}
							<p class='wrong' show={password !== confirmPassword}>
								<i class='fa fa-circle-exclamation'></i>Les mots de passe ne sont pas égaux
							</p>
						{/if}
					</article>
				</section>
				<section>
					<article>
						<label for='rgpd'>
							<input bind:checked={rgpd} id='rgpd' name='rgpd' on:change={() => rgpdTouch = true} type='checkbox' />J'accepte
							les <a class='missing' href='/rgpd' style='font-size: 0.8rem'>conditions d'utilisation</a>
						</label>
						{#if rgpdTouch}
							<p class='wrong' show={!rgpd}>
								<i class='fa fa-circle-exclamation'></i>Vous devez accepter les conditions d'utilisation.
							</p>
						{/if}
					</article>
				</section>
				<button type='submit'>S'inscrire</button>
				<a class='link' href='/auth/sign-in'>Vous avez déjà un compte?</a>
			</form>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->
