<script lang="ts">
	import { onMount } from 'svelte'
	import { fly, fade } from 'svelte/transition'
	import CanvasPanel from '$lib/svelte/components/CanvasPanel.svelte'
	import PipelineEditor from '$lib/svelte/components/PipelineEditor.svelte'
	import { isEditMode } from '$lib/svelte/stores/editorStore'
	import PipelineEngine from '$lib/pipeline/PipelineEngine'
	import { connectionsStore, pipelineStore } from '$lib/svelte/stores/stores'
	import Button from '$lib/svelte/components/ui/Button.svelte'

	// Transition durations
	const TRANSITION_DURATION = 300
	const CANVAS_TRANSITION_DURATION = 250 // Slightly faster than the editor
	const EDITOR_DELAY = 50 // Small delay before editor starts to move

	let engine: PipelineEngine | null = null
	const DEFAULT_FPS = 7.5

	// Track canvas animation state to coordinate with editor
	let isCanvasAnimating = false

	// Initialize and run the pipeline engine when not in edit mode
	$: if (!$isEditMode && !engine && $pipelineStore.length > 0) {
		startPipeline()
	}

	async function startPipeline() {
		try {
			engine = new PipelineEngine($pipelineStore, $connectionsStore, DEFAULT_FPS)
			await engine.start()
		} catch (error) {
			console.error('Error starting pipeline:', error)
		}
	}

	function toggleEditMode() {
		if ($isEditMode) {
			// Exit edit mode
			window.location.hash = ''

			// Start the pipeline if it's not running
			if (!engine && $pipelineStore.length > 0) {
				startPipeline()
			}
		} else {
			// Enter edit mode
			window.location.hash = 'edit'

			// Stop the pipeline if it's running
			if (engine) {
				engine.stop()
				engine = null
			}
		}
	}

	onMount(() => {
		// Initial check if we should start the pipeline
		if (!$isEditMode && $pipelineStore.length > 0) {
			startPipeline()
		}

		// Cleanup on component destruction
		return () => {
			if (engine) {
				engine.stop()
				engine = null
			}
		}
	})

	// Function to handle canvas transition start
	function handleCanvasTransitionStart() {
		isCanvasAnimating = true
	}

	// Function to handle canvas transition end
	function handleCanvasTransitionEnd() {
		isCanvasAnimating = false
	}
</script>

<div class="page">
	<!-- Canvas with custom transition -->
	<div
		class="canvas-container"
		class:canvas-small={$isEditMode}
		on:transitionstart={handleCanvasTransitionStart}
		on:transitionend={handleCanvasTransitionEnd}
	>
		<CanvasPanel />
	</div>

	<!-- Editor with fly transition (delayed to follow canvas) -->
	{#if $isEditMode}
		<div
			class="editor-container"
			in:fly={{ y: 500, duration: TRANSITION_DURATION, delay: EDITOR_DELAY }}
			out:fly={{ y: 500, duration: TRANSITION_DURATION }}
		>
			<PipelineEditor />
		</div>
	{/if}

	<!-- Toggle button with fade transition -->
	<div class="edit-toggle" in:fade={{ duration: TRANSITION_DURATION }}>
		<Button appearance="secondary" size="small" on:click={toggleEditMode}>
			{$isEditMode ? 'Exit Editor' : 'Edit Pipeline'}
		</Button>
	</div>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		height: 100vh;
		width: 100%;
		overflow: hidden;
		position: relative;
		background-color: var(--bg2);
	}

	.canvas-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1;
		/* Faster transition for canvas to move first */
		transition: all 350ms cubic-bezier(0.33, 1, 0.68, 1);
	}

	.canvas-small {
		height: 40%;
	}

	.editor-container {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 60%;
		background-color: var(--bg1);
		border-top: 1px solid var(--colGrey2);
		z-index: 2;
		box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
		overflow-y: auto;
	}

	/* Toggle button */
	.edit-toggle {
		position: fixed;
		bottom: 20px;
		right: 20px;
		z-index: 100;
	}

	/* Hardware acceleration hints */
	.editor-container,
	.canvas-container {
		will-change: transform;
		backface-visibility: hidden;
	}

	/* Responsive styles for different screen sizes */
	@media (max-width: 768px) {
		.canvas-small {
			height: 30%;
		}

		.editor-container {
			height: 70%;
		}
	}
</style>
