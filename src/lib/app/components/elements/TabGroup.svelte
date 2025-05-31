<script lang="ts">
	let { activeTab, onTabChange, tabHeaders, tabBody } = $props()
</script>

<div class="tab-group">
	<div class="tab-headers">
		{@render tabHeaders()}
	</div>
	<div class="tab-content">
		{@render tabBody()}
	</div>
</div>

<style>
	.tab-group {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.tab-headers {
		display: flex;
		border-bottom: 1px solid var(--color-border-subtle);
		margin-bottom: 1rem;
	}

	.tab-content {
		flex: 1;
	}
</style>
