<script lang="ts">
	//TODO Everything
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher<{
		fileLoaded: { fileName: string; content: string }
	}>()

	let fileInput: HTMLInputElement
	let selectedFileName: string = $state('')
	let fileContent: string = $state('')
	let fileError: string = $state('')

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement
		const files = target.files

		if (!files || files.length === 0) {
			fileError = 'No file selected'
			return
		}

		const file = files[0]
		selectedFileName = file.name

		const reader = new FileReader()
		reader.onload = (e) => {
			try {
				const content = e.target?.result as string
				// Validate JSON
				JSON.parse(content)
				fileContent = content
				fileError = ''

				// Notify parent component
				dispatch('fileLoaded', { fileName: selectedFileName, content })
			} catch (error) {
				fileError = 'Invalid JSON file'
				fileContent = ''
			}
		}
		reader.onerror = () => {
			fileError = 'Error reading file'
			fileContent = ''
		}
		reader.readAsText(file)
	}

	function triggerFileInput() {
		fileInput?.click()
	}
</script>

<div class="file-container">
	<div class="file-upload-area">
		<input
			type="file"
			accept=".json"
			bind:this={fileInput}
			on:change={handleFileSelect}
			style="display: none;"
		/>

		<div
			class="file-drop-zone"
			on:click={triggerFileInput}
			on:keydown={(e) => e.key === 'Enter' && triggerFileInput()}
			tabindex="0"
			role="button"
		>
			{#if selectedFileName}
				<div class="file-selected">
					<div class="file-name">{selectedFileName}</div>
					{#if fileError}
						<div class="file-error">{fileError}</div>
					{:else}
						<div class="file-success">File ready to load</div>
					{/if}
				</div>
			{:else}
				<div class="file-prompt">
					<svg class="file-icon" width="48" height="48" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6ZM6 4H13V9H18V20H6V4ZM8 12V14H16V12H8ZM8 16V18H13V16H8Z"
						/>
					</svg>
					<p>Click to select a JSON file</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.file-container {
		padding: 1rem 0;
	}

	.file-drop-zone {
		border: 2px dashed var(--color-border-subtle);
		border-radius: 8px;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
		min-height: 200px;
	}

	.file-drop-zone:hover {
		border-color: var(--color-border-focus);
		background-color: var(--color-background-hover);
	}

	.file-icon {
		color: var(--color-text-muted);
		margin-bottom: 1rem;
	}

	.file-selected {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.file-name {
		font-weight: 600;
		font-size: 1.1rem;
	}

	.file-success {
		color: var(--color-success, green);
	}

	.file-error {
		color: var(--color-error, red);
	}
</style>
