<script lang='ts'>
	import Preloader from '../../../libs/components/Preloader.svelte';
	import { goto } from '$app/navigation';

	localStorage.removeItem('auth_token');
	localStorage.removeItem('auth_mail');

	goto('/').then();
</script>
<!-- ========================= Preloader Start ========================= -->
<Preloader></Preloader>
<!-- ========================= Preloader End ========================= -->