<script lang="ts">
	import { fly } from 'svelte/transition'
	import CanvasesView from '$lib/app/views/CanvasesView.svelte'
	import Vector2 from '$lib/utils/Vector2'
	import { HashState } from '$lib/pipeline/HashState.svelte'
	import { KeyboardShortcutManager } from '$lib/pipeline/KeyboardShortcutManager.svelte'
	import GraphDrawer from '$lib/app/components/GraphDrawer.svelte'

	const hash = new HashState()
	let isEditMode = $state(true)

	hash.onChange((state) => {
		if (state === 'state') {
			isEditMode = true
		} else {
			isEditMode = false
		}
	})

	const shortcut = new KeyboardShortcutManager()
	shortcut.register('Ctrl+e', () => {
		if (hash.getState() !== 'edit') {
			hash.setState('edit')
		} else {
			hash.setState('#')
		}
	})

	const TRANSITION_DURATION = 300
	const EDITOR_DELAY = 50

	const canvasConfigurations = [{ name: 'conradCanvas', dimensions: new Vector2(512, 512) }]

	let isCanvasAnimating
</script>

<div class="app">
	<div class="canvases-container" class:edit-mode={isEditMode}>
		<CanvasesView {canvasConfigurations} />
	</div>

	<div
		class="graph-drawer-container"
		in:fly={{ y: 500, duration: TRANSITION_DURATION, delay: EDITOR_DELAY }}
		out:fly={{ y: 500, duration: TRANSITION_DURATION }}
	>
		<GraphDrawer />
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		height: 100vh;
		width: 100%;
		overflow: hidden;
		position: relative;
		background-color: var(--color-background-default);
	}

	.canvases-container {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
		transition: all 350ms cubic-bezier(0.33, 1, 0.68, 1);
	}

	.canvases-container.edit-mode {
		min-height: 40%;
		height: fit-content;
	}

	.graph-drawer-container {
		bottom: 0;
		left: 0;
		width: 100%;
		height: 60%;
		background-color: var(--color-background-elevated);
		border-top: var(--border-width-thin) solid var(--color-border-default);
		z-index: 2;
		overflow-y: none;
	}

	/* Hardware acceleration hints */
	.graph-drawer-container,
	.canvases-container {
		will-change: transform;
		backface-visibility: hidden;
	}

	/* Responsive styles for different screen sizes */
	@media (max-width: 768px) {
		.canvases-container.edit-mode {
			height: 30%;
		}

		.graph-drawer-container {
			height: 70%;
		}
	}
</style>
