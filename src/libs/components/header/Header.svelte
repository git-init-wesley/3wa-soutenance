<script lang='ts'>
	import { onMount } from 'svelte';
	import { checkAuth } from '../../functions/auth-functions';
	import { page } from '$app/stores';
	import { UserRoles } from '../../user/user';
	import './header.min.css';

	export let actualPathName;

	let loading = true;
	let logged = false;
	let user = undefined;
	let deployed = false;

	onMount(async () => {
		actualPathName = window.location.pathname;
		user = await checkAuth($page.url);
		logged = user !== undefined;
		loading = false;
	});

	const onDeploy = () => deployed = !deployed;
</script>

<!-- ========================= Header Start ========================= -->
<header>
	<section>
		<article>
			<a class='logo' href='https://3wa.fr' target='_blank'>
				<img alt='3WA - Logo' height='144' src='/icons/3wa.png' width='130' />
				<h1>FSD</h1>
			</a>
			{#if !deployed}
				<a class='open-button' href={undefined} on:click={onDeploy}><i class='fa-solid fa-bars'></i></a>
			{:else}
				<a class='close-button' href={undefined} on:click={onDeploy}><i class='fa-solid fa-xmark'></i></a>
			{/if}
		</article>
		<article>
			<nav data-deploy={deployed ? 'deploy' : undefined}>
				<a class={actualPathName === '/' ? 'actual' : ''} href='/'>
					Accueil <i class='fa fa-house'></i>
				</a>
				{#if loading}
					<a class='spinner' href={undefined}>
						<p>•</p>
					</a>
				{:else}
					{#if logged}
						{#if user?.role === UserRoles.ADMIN}
							<a class={actualPathName?.startsWith?.('/a/dash') ? 'actual' : ''} href='/a/dash'>
								Admin <i class='fa-solid fa-hammer'></i>
							</a>
						{/if}
						<a class={actualPathName?.startsWith?.('/u/task') ? 'actual' : ''} href='/u/task'>
							Tâches <i class='fa-solid fa-clipboard'></i>
						</a>
						<a class={actualPathName === '/u/profile' ? 'actual' : ''} href='/u/profile'>
							{user.username} <i class='fa fa-user'></i>
						</a>
						<a class={actualPathName === '/u/logout' ? 'actual' : ''} href='/u/logout'>
							Déconnexion <i class='fa-solid fa-arrow-right-from-bracket'></i>
						</a>
					{:else}
						<a class={actualPathName === '/auth/sign-up' ? 'actual' : ''} href='/auth/sign-up'>
							Inscription <i class='fa-solid fa-user-plus'></i>
						</a>
						<a class={actualPathName === '/auth/sign-in' ? 'actual' : ''} href='/auth/sign-in'>
							Connexion <i class='fa-solid fa-arrow-right-to-bracket'></i>
						</a>
					{/if}
				{/if}
			</nav>
		</article>
	</section>
</header>
<!-- ========================= Header End ========================= -->
