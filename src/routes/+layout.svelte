<script lang="ts">
	import type { LayoutData } from './$types.js'
	import { onMount } from 'svelte'
	import { isEditMode } from '$lib/svelte/stores/editorStore'
	import '../style.css'

	export let data: LayoutData

	let showBanner: boolean = data.showBanner

	function closeBanner(): void {
		showBanner = false
	}

	onMount(() => {
		// Initialize edit mode based on current URL hash
		isEditMode.set(window.location.hash === '#edit')

		// Listen for hash changes
		const handleHashChange = () => {
			isEditMode.set(window.location.hash === '#edit')
		}

		window.addEventListener('hashchange', handleHashChange)

		return () => {
			window.removeEventListener('hashchange', handleHashChange)
		}
	})
</script>

<slot />

{#if showBanner}
	<div class="env-banner">
		<div></div>
		⚠️ Non-production Build - {data.previewLabel}
		<button class="close" on:click={closeBanner} aria-label="Close Banner">x</button>
	</div>
{/if}

<style>
	.env-banner {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--colGrey1);
		opacity: 0.8;
		color: var(--fg0);
		display: flex;
		justify-content: space-between;
		gap: 150px;
		align-items: center;
		padding: 0.2rem 1rem;
		text-align: center;
		box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.2);
		z-index: 9999;
	}
	.env-banner .close {
		background: none;
		border: none;
		font-size: 1.2rem;
		cursor: pointer;
		color: var(--fg0);
	}
	.env-banner .close:hover {
		opacity: 0.7;
	}
</style>
