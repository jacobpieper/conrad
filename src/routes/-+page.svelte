<script lang="ts">
	import CanvasPanel from '$lib/svelte/components/CanvasPanel.svelte'
	import PipelineEditor from '$lib/svelte/components/PipelineEditor.svelte'
</script>

<div class="page">
	<div class="content">
		<main class="display">
			<CanvasPanel />
		</main>
		<aside class="sidebar">
			<PipelineEditor />
		</aside>
	</div>
</div>

<style>
	.page {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
		background-color: var(--bg1);
	}
	.content {
		display: flex;
		height: 100%;
		width: fit-content;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
		background-color: var(--bg2);
	}
	.display {
		width: 1440px;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: var(--bg2);
	}
	.sidebar {
		width: 960px;
		border-left: 1px solid var(--colGrey0);
		overflow-y: auto;
		background-color: var(--bg3);
	}
</style>
