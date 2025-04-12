<script lang="ts">
	import type { LayoutData } from './$types.js'
	import '../style.css'

	export let data: LayoutData
</script>

<slot />

<!-- svelte-ignore ts-2339 -->
{#if data.showBanner}
	<div class="env-banner">
		⚠️ Non-production Build - {import.meta.env.VERCEL_ENV ?? 'development'}
	</div>
{/if}

<style>
	.env-banner {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--colYellow0);
		opacity: 0.7;
		color: var(--fg0);
		text-align: center;
		font-weight: bold;
		box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2);
		z-index: 9999;
	}
</style>
