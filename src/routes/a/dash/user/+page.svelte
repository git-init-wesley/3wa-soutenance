<script lang='ts'>
	import Preloader from '../../../../libs/components/Preloader.svelte';
	import Header from '../../../../libs/components/Header.svelte';
	import Footer from '../../../../libs/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { checkAuth } from '../../../../libs/functions/auth-functions';
	import { page } from '$app/stores';
	import moment from 'moment';
	import { UserRoles } from '../../../../libs/user/user';

	let loading = true;
	let auth_token = undefined;
	let auth_email = undefined;
	let user = undefined;
	let users = [];
	let filteredSearch = '';

	onMount(async () => {
		auth_token = localStorage.getItem('auth_token');
		auth_email = localStorage.getItem('auth_email');
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
			if (user) {
				const url: URL = new URL(`${$page.url.origin}/api/a/user/read/all`);
				url.searchParams.set('email', auth_email ?? '');
				url.searchParams.set('token', auth_token ?? '');
				const resp: Response = await fetch(url);
				users = (await resp.json())?.users ?? [];
			}
			loading = false;
		}, 10);
	});

	const onDeleteUser = async (id) => {
		loading = true;
		const url: URL = new URL(`${$page.url.origin}/api/a/user/delete`);
		url.searchParams.set('email', auth_email ?? '');
		url.searchParams.set('token', auth_token ?? '');
		url.searchParams.set('user_id', id ?? '');
		const resp: Response = await fetch(url);
		if (resp.ok) {
			const finalDropId = (await resp.json()).id;
			users = users.filter(f => f.id !== finalDropId);
		}
		loading = false;
	};

</script>

<svelte:head>
	<title>FSD - Dash - Utilisateurs</title>
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
			<a class='link' href={`/a/dash`}><i class='fa-solid fa-arrow-left-long'></i> Retour</a>
		</article>
	</section>

	<section class='users-table'>
		<article class='table-header'>
			<form class='forms' on:submit|preventDefault>
				<section>
					<article>
						<input bind:value={filteredSearch} class='search-input' id='filtered-search' name='filtered-search'
									 placeholder='Rechercher un utilisateur (username/email)' type='text' />
					</article>
				</section>
				<section>
					<article>
						<button type='submit'><i class='fa fa-search'></i></button>
					</article>
				</section>
			</form>
		</article>
		<article class='table-items'>
			{#each users.filter(f => {
				if (filteredSearch === '' || filteredSearch === undefined) return true;
				return f?.username?.toLowerCase?.().startsWith?.(filteredSearch?.toLowerCase?.()) || f?.email?.toLowerCase?.().startsWith?.(filteredSearch?.toLowerCase?.())
			}) as user, i}
				<section>
					<article class='table-item-header'>
						<h1>
							{#if user.role === UserRoles.ADMIN}
								<i class='fa-solid fa-crown primary'></i>
							{/if}
							<a href={`${$page.url.origin}/a/dash/user/details/${user.id}`}>
								{user?.username?.toLowerCase?.()}
							</a>
							{#if user.role !== UserRoles.ADMIN}
								<i on:keyup|preventDefault on:click={() => onDeleteUser(user.id)} class='delete fa fa-xmark'></i>
							{/if}
						</h1>
						<h2>{user.email}</h2>
					</article>
					<article class='table-item-footer'>
						<p>
							Dernière mise à jour le {moment(new Date(user?.updated_at)).format('DD/MM/YYYY à HH:mm:ss')}
						</p>
						<p>
							Compte crée le {moment(new Date(user?.created_at)).format('DD/MM/YYYY à HH:mm:ss')}
						</p>
					</article>
				</section>
			{/each}
		</article>
		<article class='table-footer'>
			<p>Nombre d'utilisateur : {users.length}</p>
		</article>
	</section>
</main>


<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->