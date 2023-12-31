<script lang='ts'>
	import Preloader from '../../../libs/components/preloader/Preloader.svelte';
	import Header from '../../../libs/components/header/Header.svelte';
	import Footer from '../../../libs/components/footer/Footer.svelte';
	import { onMount } from 'svelte';
	import { checkAuth } from '../../../libs/functions/auth-functions';
	import { page } from '$app/stores';
	import moment from 'moment';
	import { goto } from '$app/navigation';

	let loading = true;
	let auth_token = undefined;
	let auth_email = undefined;
	let user = undefined;
	let tasks = [];
	let filteredSearch = '';

	onMount(async () => {
		auth_token = localStorage.getItem('auth_token');
		auth_email = localStorage.getItem('auth_email');
		document.getElementById('currentYear').innerHTML = new Date().getFullYear().toString();
		await setTimeout(async () => {
			user = await checkAuth($page.url);
			if (user) {
				const url: URL = new URL(`${$page.url.origin}/api/task/read/all`);
				url.searchParams.set('email', auth_email ?? '');
				url.searchParams.set('token', auth_token ?? '');
				const resp: Response = await fetch(url);
				tasks = (await resp.json())?.tasks ?? [];
			}
			loading = false;
		}, 10);
	});

	const onDeleteTask = async (id) => {
		loading = true;
		const url: URL = new URL(`${$page.url.origin}/api/task/delete`);
		url.searchParams.set('email', auth_email ?? '');
		url.searchParams.set('token', auth_token ?? '');
		url.searchParams.set('task_id', id ?? '');
		const resp: Response = await fetch(url);
		if (resp.ok) {
			const finalDropId = (await resp.json()).id;
			tasks = tasks.filter(f => f.id !== finalDropId);
		}
		loading = false;
	};

	const onUpdateTask = async (task) => {
		loading = true;
		const url: URL = new URL(`${$page.url.origin}/api/task/update`);
		url.searchParams.set('email', auth_email ?? '');
		url.searchParams.set('token', auth_token ?? '');
		url.searchParams.set('task_id', task?.id);
		url.searchParams.set('title', task.title);
		url.searchParams.set('finished', String(!task.finished));
		if (task.description) url.searchParams.set('description', task.description);
		if (task.content) url.searchParams.set('content', task.content);
		const resp: Response = await fetch(url);
		loading = false;
	};

	const onGotoTaskCreate = async () => await goto('/u/task/create');
</script>

<svelte:head>
	<title>FSD - Tâches</title>
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

	{#if tasks?.length > 0}
		<section class='tasks-table'>
			<article class='table-header'>
				<form class='forms' on:submit|preventDefault>
					<section>
						<article>
							<input bind:value={filteredSearch} class='search-input' id='filtered-search' name='filtered-search'
										 placeholder='Rechercher une tâche' type='text' />
						</article>
					</section>
					<section>
						<article>
							<button type='submit'><i class='fa fa-search'></i></button>
						</article>
					</section>
				</form>
			</article>
			<form class='forms' on:submit|preventDefault>
				<button on:click={onGotoTaskCreate}>
					Ajouter une tâche <i class='fa fa-add'></i>
				</button>
			</form>
			<article class='table-items'>
				{#each tasks.filter(f => {
					if (filteredSearch === '' || filteredSearch === undefined) return true;
					return f?.title?.toLowerCase?.().startsWith?.(filteredSearch?.toLowerCase?.())
				}) as task, i}
					<section>
						<article class='table-item-header'>
							<h1>
								<input bind:checked={task.finished} on:click={()  => onUpdateTask(task)} type='checkbox' />
								<a href={`${$page.url.origin}/u/task/details/${task.id}`}>
									{task?.title?.toLowerCase?.()}
								</a>
								<i on:keyup|preventDefault on:click={() => onDeleteTask(task.id)} class='delete fa fa-trash'></i>
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
								Tâche crée le {moment(new Date(task?.created_at)).format('DD/MM/YYYY à HH:mm:ss')}
							</p>
						</article>
					</section>
				{/each}
			</article>
			<article class='table-footer'>
				<p>Nombre de tâche : {tasks.length}</p>
			</article>
		</section>
	{:else}
		<section>
			<article>
				<h1>Vous n'avez pas encore de tâche.</h1>
			</article>
		</section>
	{/if}
	<section class='tasks-add' on:click={onGotoTaskCreate} on:keyup|preventDefault>
		<article>
			<i class='fa fa-add'></i>
		</article>
	</section>
</main>


<!-- ========================= Footer Start ========================= -->
<Footer></Footer>
<!-- ========================= Footer End ========================= -->