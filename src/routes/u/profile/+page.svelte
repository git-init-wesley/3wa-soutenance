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
	import { goto } from '$app/navigation';

	let loading = true;
	let _relaunchHeader = true;
	let errorUsernameMessage = undefined;
	let errorEmailMessage = undefined;
	let errorPasswordMessage = undefined;
	let successUsernameMessage = undefined;
	let successEmailMessage = undefined;
	let successPasswordMessage = undefined;

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
			email = localStorage.getItem('_email');
			_email = email;
			_token = localStorage.getItem('_token');
			loading = false;
		}, 10);
	});

	let usernameTouch = false;
	let usernameTooltips = false;
	let emailTouch = false;
	let passwordTouch = false;
	let passwordTooltips = false;


	const onSubmit = async (_: Event) => {
		loading = true;
		errorUsernameMessage = undefined;
		errorEmailMessage = undefined;
		errorPasswordMessage = undefined;
		successUsernameMessage = undefined;
		successEmailMessage = undefined;
		successPasswordMessage = undefined;
		usernameTouch = true;
		emailTouch = true;
		passwordTouch = true;

		let validate = true;

		if (_username !== username) {
			if (!RegexUsername.test(username)) validate = false;
			if (validate) {
				const url: URL = new URL(`${$page.url.origin}/api/u/update/username`);
				url.searchParams.set('old_username', _username);
				url.searchParams.set('new_username', username);
				url.searchParams.set('token', _token);
				const resp: Response = await fetch(url);
				if (resp.ok) {
					_relaunchHeader = !_relaunchHeader;
					_username = username;
					successUsernameMessage = 'Changement de pseudonyme pris en compte.';
					user = await resp.json();
				} else {
					if (resp.status === 406 || resp.status === 403) errorUsernameMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
					else errorUsernameMessage = resp.statusText;
				}
			}
		}

		validate = true;

		if (_email !== email) {
			if (!RegexMail.test(email)) validate = false;
			if (validate) {
				const url: URL = new URL(`${$page.url.origin}/api/u/update/email`);
				url.searchParams.set('old_email', _email);
				url.searchParams.set('new_email', email);
				url.searchParams.set('token', _token);
				const resp: Response = await fetch(url);
				if (resp.ok) {
					localStorage.setItem('_email', email);
					_email = email;
					successEmailMessage = 'Changement d\'adresse mail pris en compte.';
					user = await resp.json();
				} else {
					if (resp.status === 406 || resp.status === 403) errorEmailMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
					else errorEmailMessage = resp.statusText;
				}
			}
		}

		validate = true;

		if (password !== undefined) {
			if (!RegexPassword.test(password)) validate = false;
			if (validate) {
				const url: URL = new URL(`${$page.url.origin}/api/u/update/password`);
				url.searchParams.set('email', _email);
				url.searchParams.set('new_password', password);
				url.searchParams.set('token', _token);
				const resp: Response = await fetch(url);
				if (resp.ok) {
					password = undefined;
					successPasswordMessage = 'Changement de mot de passe pris en compte.';
					user = await resp.json();
				} else {
					if (resp.status === 406 || resp.status === 403) errorPasswordMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
					else errorPasswordMessage = resp.statusText;
				}
			}
		}

		loading = false;
	};

	const deleteToken = async (token: string) => {
		loading = true;
		const url: URL = new URL(`${$page.url.origin}/api/auth/sign-in/token/delete`);
		url.searchParams.set('email', _email);
		url.searchParams.set('token', token);
		await fetch(url);
		user.tokens = user.tokens.filter(f => f.token !== token);
		if (token === _token) await goto('/');
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
{#if _relaunchHeader}
	<Header></Header>
{:else}
	<Header></Header>
{/if}
<!-- ========================= Header End ========================= -->

<main>
	<!-- ========================= Forms Start ========================= -->
	<section class='forms container'>
		<article>
			<img alt='3WA - Logo' height='144' src='/icons/3wa.png' width='130' />
			<h1>Profil</h1>
			{#if errorUsernameMessage}
				<h2 class='error'><i class='fa fa-circle-xmark'></i>{errorUsernameMessage}</h2>
			{/if}
			{#if successUsernameMessage}
				<h2 class='check'><i class='fa fa-circle-check'></i>{successUsernameMessage}</h2>
			{/if}
			{#if errorEmailMessage}
				<h2 class='error'><i class='fa fa-circle-xmark'></i>{errorEmailMessage}</h2>
			{/if}
			{#if successEmailMessage}
				<h2 class='check'><i class='fa fa-circle-check'></i>{successEmailMessage}</h2>
			{/if}
			{#if errorPasswordMessage}
				<h2 class='error'><i class='fa fa-circle-xmark'></i>{errorPasswordMessage}</h2>
			{/if}
			{#if successPasswordMessage}
				<h2 class='check'><i class='fa fa-circle-check'></i>{successPasswordMessage}</h2>
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
									 placeholder='••••••••'
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
				<button
					disabled={_username !== username || _email !== email || password !== undefined	 ? undefined : 'disabled'}
					type='submit'>
					Enregistrer
				</button>
			</form>
			<h6 class='small-date'>Dernière mise à jour
				le {moment(new Date(user?.updated_at)).format('DD/MM/YYYY à HH:mm:ss')}</h6>
			<h6 class='small-date'>Compte crée le {moment(new Date(user?.created_at)).format('DD/MM/YYYY à HH:mm:ss')}</h6>
		</article>
	</section>
	<!-- ========================= Forms End ========================= -->

	<!-- ========================= Sessions Start ========================= -->
	<section class='sessions container' style='margin-top: 1.5rem'>
		<article>
			<h1>Sessions</h1>
			{#if user?.tokens}
				{#each user?.tokens as token, i}
					<section class='session'>
						<article>
							{#if _token === token.token}
								<a class='success link our-session' href={undefined} on:click={() => deleteToken(token.token)}>
									<i class='fa fa-circle'></i>Votre session
								</a>
							{:else}
								<a class='link' href={undefined} on:click={() => deleteToken(token.token)}>
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