<!--suppress HtmlWrongAttributeValue -->
<script lang='ts'>

	import { onMount } from 'svelte';
	import moment from 'moment';
	import Footer from '../../../../../../../libs/components/footer/Footer.svelte';
	import Header from '../../../../../../../libs/components/header/Header.svelte';
	import Preloader from '../../../../../../../libs/components/preloader/Preloader.svelte';
	import { page } from '$app/stores';
	import { checkAuth } from '../../../../../../../libs/functions/auth-functions';
	import {
		RegexMail,
		RegexSpecialCharacters,
		RegexTo_3_16,
		RegexUsername
	} from '../../../../../../../libs/utils/utils';
	import { goto } from '$app/navigation';

	let loading = true;
	let errorMessage = undefined;
	let errorUsernameMessage = undefined;
	let successUsernameMessage = undefined;

	let username = undefined;
	let email = undefined;
	let user = undefined;
	let findUser = undefined;
	let auth_email = undefined;
	let auth_token = undefined;

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
			auth_email = localStorage.getItem('auth_email');
			auth_token = localStorage.getItem('auth_token');

			const url: URL = new URL(`${$page.url.origin}/api/a/user/read`);
			url.searchParams.set('email', auth_email ?? '');
			url.searchParams.set('token', auth_token ?? '');
			url.searchParams.set('user_id', $page.params.id);

			const resp: Response = await fetch(url);

			if (resp.ok) {
				findUser = await resp.json();
				username = findUser?.username;
				email = findUser?.email;
			} else {
				if (resp.status === 406 || resp.status === 403) errorMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
				else errorMessage = resp.statusText;
			}

			loading = false;
		}, 10);
	});

	let usernameTouch = false;
	let usernameTooltips = false;
	let emailTouch = false;

	const onSubmit = async (_: Event) => {
		loading = true;
		errorUsernameMessage = undefined;
		successUsernameMessage = undefined;
		usernameTouch = true;
		emailTouch = true;

		let validate = true;

		if (findUser?.username !== username) {
			if (!RegexUsername.test(username)) validate = false;
			if (validate) {
				const url: URL = new URL(`${$page.url.origin}/api/a/user/update/username`);
				url.searchParams.set('old_username', findUser?.username);
				url.searchParams.set('new_username', username);
				url.searchParams.set('email', auth_email);
				url.searchParams.set('token', auth_token);
				const resp: Response = await fetch(url);
				if (resp.ok) {
					successUsernameMessage = 'Changement de pseudonyme pris en compte.';
					findUser = await resp.json();
				} else {
					if (resp.status === 406 || resp.status === 403) errorUsernameMessage = (await resp.json())?.message ?? 'Erreur inconnue.';
					else errorUsernameMessage = resp.statusText;
				}
			}
		}

		loading = false;
	};

	const onGotoUserCancel = async () => await goto(`/a/dash/user/details/${findUser?.id}`);
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
	<section class='bar-link'>
		<article class='forms'>
			<a class='link' href={`/a/dash/user/details/${findUser?.id}`}><i class='fa-solid fa-arrow-left-long'></i>
				Retour</a>
		</article>
	</section>

	<!-- ========================= Forms Start ========================= -->
	<section class='forms container'>
		<article>
			<h1>Modification</h1>
			{#if errorMessage}
				<h2 class='error'><i class='fa fa-circle-xmark'></i>{errorMessage}</h2>
			{/if}
			{#if errorUsernameMessage}
				<h2 class='error'><i class='fa fa-circle-xmark'></i>{errorUsernameMessage}</h2>
			{/if}
			{#if successUsernameMessage}
				<h2 class='check'><i class='fa fa-circle-check'></i>{successUsernameMessage}</h2>
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
						<input bind:value={email} disabled id='email' name='email'
									 on:focusout={() => {emailTouch = true}} placeholder='test@example.fr'
									 required type='email' />
						{#if emailTouch}
							<p class='wrong' show={!RegexMail.test(email)}>
								<i class='fa fa-circle-exclamation'></i>Adresse mail incorrecte
							</p>
						{/if}
					</article>
				</section>
				<button
					disabled={findUser?.username !== username || findUser?.email !== email	 ? undefined : 'disabled'}
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

	<section class='tasks-edit' on:click={onGotoUserCancel} on:keyup|preventDefault>
		<article>
			<i class='fa fa-xmark'></i>
		</article>
	</section>
</main>

<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->