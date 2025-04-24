<script lang="ts">
	import { fly, fade } from 'svelte/transition'
	import CanvasPanel from './CanvasPanel.svelte'
	import Vector2 from '$lib/utils/Vector2'
	import { HashState } from '$lib/pipeline/HashState.svelte'
	import GraphEditPanel from './GraphEditPanel.svelte'
	import { KeyboardShortcutManager } from '$lib/pipeline/KeyboardShortcutManager.svelte'

	const hash = new HashState()
	let isEditMode = $state(true)

	hash.onChange((state) => {
		if (state === 'edit') {
			isEditMode = true
		} else {
			isEditMode = false
		}
	})

	const shortcutManager = new KeyboardShortcutManager()

	shortcutManager.register('Ctrl+e', () => {
		hash.setState('edit')
	})

	shortcutManager.register('Ctrl+d', () => {
		hash.setState('#')
	})

	// ~ Constants
	const TRANSITION_DURATION = 300
	const EDITOR_DELAY = 50

	const DEFAULT_FPS = 4

	const canvasConfigurations = [{ name: 'conradCanvas', dimensions: new Vector2(512, 512) }]

	let isCanvasAnimating

	function handleCanvasTransitionStart() {
		isCanvasAnimating = true
	}

	function handleCanvasTransitionEnd() {
		isCanvasAnimating = false
	}
</script>

<div class="page">
	<div
		class="canvas-panel-container"
		class:edit-mode={isEditMode}
		on:transitionstart={handleCanvasTransitionStart}
		on:transitionend={handleCanvasTransitionEnd}
	>
		<CanvasPanel {canvasConfigurations} {isEditMode} />
	</div>

	{#if isEditMode}
		<div
			class="graph-edit-panel-container"
			in:fly={{ y: 500, duration: TRANSITION_DURATION, delay: EDITOR_DELAY }}
			out:fly={{ y: 500, duration: TRANSITION_DURATION }}
		>
			<GraphEditPanel />
		</div>
	{/if}
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		height: 100vh;
		width: 100%;
		overflow: hidden;
		position: relative;
		background-color: var(--color-background-default);
	}

	.canvas-panel-container {
		position: absolute;
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

	.canvas-panel-container.edit-mode {
		min-height: 40%;
		height: fit-content;
	}

	.graph-edit-panel-container {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 60%;
		background-color: var(--color-background-elevated);
		border-top: var(--border-width-thin) solid var(--color-border-default);
		z-index: 2;
		overflow-y: auto;
	}

	/* Hardware acceleration hints */
	.graph-edit-panel-container,
	.canvas-panel-container {
		will-change: transform;
		backface-visibility: hidden;
	}

	/* Responsive styles for different screen sizes */
	@media (max-width: 768px) {
		.canvas-panel-container.edit-mode {
			height: 30%;
		}

		.graph-edit-panel-container {
			height: 70%;
		}
	}
</style>
