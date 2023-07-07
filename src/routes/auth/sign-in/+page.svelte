<script lang='ts'>

	import { onMount } from 'svelte';
	import Footer from '../../../libs/components/Footer.svelte';
	import Header from '../../../libs/components/Header.svelte';
	import Preloader from '../../../libs/components/Preloader.svelte';
	import {
		RegexMail,
		RegexPassword,
		RegexSpecialCharacters,
		RegexTo_09,
		RegexTo_8_32,
		RegexTo_AZ,
		RegexTo_az
	} from '../../../libs/utils/utils';
	import { goto } from '$app/navigation';
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

	let email = '';
	let emailTouch = false;
	let password = '';
	let passwordTouch = false;
	let passwordTooltips = false;

	const onSubmit = async (_: Event) => {
		loading = true;

		emailTouch = true;
		passwordTouch = true;

		let validate = true;
		if (!RegexMail.test(email)) validate = false;
		if (!RegexPassword.test(password)) validate = false;

		if (!validate) {
			loading = false;
			return;
		}


		const url: URL = new URL(`${$page.url.origin}/api/auth/sign-in/credentials`);
		url.searchParams.set('email', email);
		url.searchParams.set('password', password);
		const resp: Response = await fetch(url);
		if (!resp.ok) {
			if (resp.status === 406 || resp.status === 403)
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
		localStorage.setItem('auth_mail', email);

		//TODO: Redirect
		await goto('/');

		loading = false;
	};
</script>

<svelte:head>
	<title>FSD - Auth/Connexion</title>
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
			<h1>Connexion</h1>
			{#if errorMessage}
				<h2 class='error'><i class='fa fa-circle-xmark'></i>{errorMessage}</h2>
			{/if}
			<form on:submit|preventDefault={onSubmit}>
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
						<a class='missing' href='/auth/recovery'>Mot de passe oublié?</a>
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
				<button type='submit'>Se connecter</button>
				<a class='link' href='/auth/sign-up'>Vous n'avez pas de compte?</a>
			</form>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->
