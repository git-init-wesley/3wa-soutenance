<!--suppress HtmlWrongAttributeValue -->
<script lang='ts'>

	import { onMount } from 'svelte';
	import moment from 'moment';
	import Footer from '../../../libs/components/Footer.svelte';
	import Header from '../../../libs/components/Header.svelte';
	import Preloader from '../../../libs/components/Preloader.svelte';
	import { page } from '$app/stores';
	import { checkAuth } from '../../../libs/functions/auth-functions';
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

	let loading = true;
	let errorMessage = undefined;

	let username = undefined, _username = undefined;
	let email = undefined, _email = undefined;
	let password = undefined;
	let user = undefined;
	let _token;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
			username = user?.username;
			_username = username;
			email = localStorage.getItem('auth_mail');
			_email = email;
			_token = localStorage.getItem('auth_token');
			loading = false;
		}, 300);
	});

	let usernameTouch = false;
	let usernameTooltips = false;
	let emailTouch = false;
	let passwordTouch = false;
	let passwordTooltips = false;


	const onSubmit = async (_: Event) => {
		loading = true;
		errorMessage = undefined;
		usernameTouch = true;
		emailTouch = true;
		passwordTouch = true;

		let validate = true;
		if (!RegexUsername.test(username)) validate = false;
		if (!RegexMail.test(email)) validate = false;
		if (password !== undefined && !RegexPassword.test(password)) validate = false;

		if (!validate) {
			loading = false;
			return;
		}

		/*const url: URL = new URL(`${$page.url.origin}/api/auth/sign-up`);
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
		localStorage.setItem('auth_mail', email);

		//TODO: Redirect
		await goto('/');

		loading = false;*/
	};

	const deleteToken = async (token: string) => {
		loading = true;
		const url: URL = new URL(`${$page.url.origin}/api/auth/sign-in/token/delete`);
		url.searchParams.set('email', _email);
		url.searchParams.set('token', token);
		await fetch(url);
		user.tokens = user.tokens.filter(f => f.token !== token);
		loading = false;
	};

	const diffDate = (created_at) => (moment(new Date()).diff(moment(new Date(created_at))) / 1000 / 60 / 60 / 24).toFixed(0);
</script>

<svelte:head>
	<title>FSD - Profil</title>
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
			<h1>Profil</h1>
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
						{#if passwordTouch && !!password}
							<p class='wrong' show={!RegexPassword.test(password)}>
								<i class='fa fa-circle-exclamation'></i>Mot de passe incorrecte
							</p>
						{/if}
					</article>
					<article class='tooltips' show={passwordTooltips}>
						<p>
							<i
								class={RegexTo_09.test(password ?? '') ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins un chiffre.
						</p>
						<p>
							<i
								class={RegexTo_az.test(password ?? '') ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins une minuscule.
						</p>
						<p>
							<i
								class={RegexTo_AZ.test(password ?? '') ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins une majuscule.
						</p>
						<p>
							<i
								class={RegexSpecialCharacters.test(password ?? '') ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins un caractère spécial.
						</p>
						<p>
							<i
								class={RegexTo_8_32.test(password ?? '') ? 'fa fa-circle-check success' : 'fa fa-circle-xmark primary'}></i>
							Au moins 8 caractères, mais pas plus de 32.
						</p>
					</article>
				</section>
				<button disabled={_username !== username || _email !== email ? undefined : 'disabled'} type='submit'>
					Enregistrer
				</button>
			</form>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->

	<!-- ========================= Sessions Start ========================= -->
	<section class='sessions container' style='margin-top: 1.5rem'>
		<article>
			<h1>Sessions</h1>

			{#if user?.tokens}
				{#each user?.tokens as token, i}
					<section class='session' on:click={() => deleteToken(token.token)}>
						<article>
							{#if _token === token.token}
								<a class='success link our-session'>
									<i class='fa fa-circle'></i>Votre session
								</a>
							{:else}
								<a class='link'>
									<i class='fa fa-xmark'></i>Fermer la session
								</a>
							{/if}
						</article>
						<article>
							<p class='token'>
								{token.token}
							</p>
							<p class='date'>
								{moment(new Date(token.created_at)).format('DD/MM/YYYY à hh:mm:ss (Zz)')} -
								{#if diffDate(token.created_at) < 30}
								<span class='expired'>
									Expire dans ~{Math.abs(diffDate(token.created_at) - 30)}jours
								</span>
								{:else}
									<span class='expired'>
									Expirée
								</span>
								{/if}
							</p>
						</article>
					</section>
				{/each}
			{/if}
		</article>
	</section>
	<!-- ========================= Sessions End ========================= -->
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->