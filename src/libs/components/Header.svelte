<script lang='ts'>
	import { onMount } from 'svelte';

	export let actualPathName;

	onMount(() => {
		actualPathName = window.location.pathname;
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
				<a class={actualPathName === '/auth/sign-up' ? 'actual' : ''} href='/auth/sign-up'>Inscription</a>
				<a class={actualPathName === '/auth/sign-in' ? 'actual' : ''} href='/auth/sign-in'>Connexion</a>
			</nav>
		</article>
	</section>
</header>
<!-- ========================= Header End ========================= -->
