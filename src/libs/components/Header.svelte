<script lang='ts'>
	import { onMount } from 'svelte';
	import { checkAuth } from '../functions/auth-functions';
	import { page } from '$app/stores';

	export let actualPathName;

	let loading = true;
	let logged = false;

	onMount(async () => {
		actualPathName = window.location.pathname;
		logged = await checkAuth($page.url) === true;
		loading = false;
	});
</script>

<!-- ========================= Header Start ========================= -->
<header>
	<section>
		<article>
			<a class='logo' href='https://3wa.fr' target='_blank'>
				<img alt='3WA - Logo' height='144' src='/icons/3wa.png' width='130' />
				<h1>FSD</h1>
			</a>
			<nav>
				<a class={actualPathName === '/' ? 'actual' : ''} href='/'>Accueil</a>
				{#if loading}
					<a class='spinner' href={undefined}>
						<p>•</p>
					</a>
				{:else}
					{#if logged}
						<a class={actualPathName === '/u/task' ? 'actual' : ''} href='/u/task'>Tâches</a>
						<a class={actualPathName === '/u/profile' ? 'actual' : ''} href='/u/profile'>
							<i class='fa fa-user'></i>
						</a>
						<a class={actualPathName === '/u/logout' ? 'actual' : ''} href='/u/logout'>
							<i class='fa-solid fa-arrow-right-from-bracket'></i>
						</a>
					{:else}
						<a class={actualPathName === '/auth/sign-up' ? 'actual' : ''} href='/auth/sign-up'>Inscription</a>
						<a class={actualPathName === '/auth/sign-in' ? 'actual' : ''} href='/auth/sign-in'>Connexion</a>
					{/if}
				{/if}
			</nav>
		</article>
	</section>
</header>
<!-- ========================= Header End ========================= -->
