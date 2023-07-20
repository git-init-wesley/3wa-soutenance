<script lang='ts'>
	import Preloader from '../../../libs/components/Preloader.svelte';
	import Header from '../../../libs/components/Header.svelte';
	import Footer from '../../../libs/components/Footer.svelte';
	import { onMount } from 'svelte';
	import { checkAuth } from '../../../libs/functions/auth-functions';
	import { page } from '$app/stores';
	import moment from 'moment';

	let loading = true;
	let user = undefined;
	let tasks = [];
	let filteredSearch = '';

	onMount(async () => {
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
			if (user) {
				const auth_token = localStorage.getItem('auth_token');
				const auth_mail = localStorage.getItem('auth_mail');
				const url: URL = new URL(`${$page.url.origin}/api/task/read/all`);
				url.searchParams.set('email', auth_mail ?? '');
				url.searchParams.set('token', auth_token ?? '');
				const resp: Response = await fetch(url);
				tasks = (await resp.json())?.tasks ?? [];
			}
			loading = false;
		}, 300);
	});

	const onDeleteTask = (id) => {
		console.log(id);
	}

</script>

<!-- ========================= Preloader Start ========================= -->
{#if loading}
	<Preloader></Preloader>
{/if}
<!-- ========================= Preloader End ========================= -->

<!-- ========================= Header Start ========================= -->
<Header></Header>
<!-- ========================= Header End ========================= -->


<main>

	<section class='tasks-table'>
		<article class='table-header'>
			<form on:submit|preventDefault class='forms'>
				<section>
					<article>
						<input class='search-input' bind:value={filteredSearch} placeholder='Rechercher une tâche' type='text'
									 name='filtered-search' id='filtered-search' />
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
			{filteredSearch}
			{#each tasks.filter(f => {
				if (filteredSearch === '' || filteredSearch === undefined) return true;
				return f?.title?.toLowerCase?.().startsWith?.(filteredSearch?.toLowerCase?.())
			}) as task, i}
				<section>
					<article class='table-item-header'>
						<h1>
							<a href={`${$page.url.origin}/u/task/details/${task.id}`}>
								{task?.title}
							</a>
							<i on:click={() => onDeleteTask(task.id)} class='delete fa fa-xmark'></i>
						</h1>
						{#if task.description}
							<h2>
								{task.description}
							</h2>
						{/if}
					</article>
					<article class='table-item-footer'>
						<p>
							Dernière mise à jour le {moment(new Date(task?.updated_at)).format('DD/MM/YYYY à HH:mm:ss')}
						</p>
						<p>
							Compte crée le {moment(new Date(task?.created_at)).format('DD/MM/YYYY à HH:mm:ss')}
						</p>
					</article>
				</section>
			{/each}
		</article>
		<article class='table-footer'>
			<p>Nombre de tâche : {tasks.length}</p>
		</article>
	</section>

</main>


<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->