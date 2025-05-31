<script lang="ts">
	import { onMount, onDestroy, type Snippet } from 'svelte'

	let {
		isOpen = false,
		title = '',
		showCloseButton = true,
		closeOnClickOutside = true,
		closeOnEsc = true,
		maxWidth = '500px',
		modalBody,
		modalFooter,
		closeModal = undefined,
	}: {
		isOpen?: boolean
		title?: string
		showCloseButton?: boolean
		closeOnClickOutside?: boolean
		closeOnEsc?: boolean
		maxWidth?: string
		modalBody: Snippet
		modalFooter: Snippet
		closeModal?: (event: { modalId: string }) => void
	} = $props()

	let modalId: string = 'One'

	let modalElement: HTMLDivElement | null = $state(null)
	let modalContent: HTMLDivElement | null = $state(null)

	function handleBackdropClick(event: MouseEvent): void {
		if (closeModal) {
			if (closeOnClickOutside && event.target === modalElement) {
				closeModal({ modalId })
			}
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
{#if isOpen}
	<div class="modal-backdrop" bind:this={modalElement} onclick={handleBackdropClick}>
		<div class="modal-content" bind:this={modalContent} style={`max-width: ${maxWidth}`}>
			<div class="modal-header">
				<h2 class="modal-title">{title}</h2>
				{#if showCloseButton}
					<button class="close-button" onclick={() => closeModal?.({ modalId })}>x</button>
				{/if}
			</div>
			<div class="modal-body">
				{@render modalBody()}
			</div>
			<div class="modal-footer">
				{@render modalFooter()}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease-out;
	}

	.modal-content {
		background: var(--color-background-default);
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		animation: slideIn 0.2s ease-out;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 24px;
		border-bottom: 1px solid var(--color-border-subtle);
	}

	.modal-title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-text-default);
	}

	.close-button {
		background: none;
		border: none;
		font-size: 24px;
		cursor: pointer;
		color: var(--color-text-muted);
		line-height: 1;
		padding: 0;
	}

	.close-button:hover {
		color: var(--color-text-default);
	}

	.modal-body {
		padding: 24px;
		overflow-y: auto;
		flex: 1;
	}

	.modal-footer {
		padding: 16px 24px;
		border-top: 1px solid var(--color-border-subtle);
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideIn {
		from {
			transform: translateY(-20px);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
