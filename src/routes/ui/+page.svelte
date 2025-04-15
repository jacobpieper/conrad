<script lang="ts">
	import Button from '$lib/svelte/components/ui/Button.svelte'
</script>

<div class="container">
	<h1>UI Components</h1>
	<h2>Buttons</h2>
	<div class="groups">
		<div class="button-container sub-container">
			<div class="sub-sub-container">
				<Button appearance="primary" size="small">Primary</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="secondary" size="small">Secondary</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="subtle" size="small">Subtle</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="danger" size="small">Danger</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="link" size="small">Link</Button>
			</div>
		</div>
		<div class="button-container sub-container">
			<div class="sub-sub-container">
				<Button appearance="primary">Primary</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="secondary">Secondary</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="subtle">Subtle</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="danger">Danger</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="link">Link</Button>
			</div>
		</div>
		<div class="button-container sub-container">
			<div class="sub-sub-container">
				<Button appearance="primary" size="large">Primary</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="secondary" size="large">Secondary</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="subtle" size="large">Subtle</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="danger" size="large">Danger</Button>
			</div>
			<div class="sub-sub-container">
				<Button appearance="link" size="large">Link</Button>
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		padding: 1.5rem;
	}
	.sub-container {
		padding: 1rem;
		background-color: var(--bg2);
		display: flex;
		gap: 5rem;
		border-radius: 8px;
		border: 1px solid var(--colGrey5);
		box-shadow: var(--shadow-md);
	}
	.sub-sub-container {
		width: fit-content;
	}
	.groups {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	h2 {
		padding: 1rem 0;
	}
	h3 {
		font-size: 1.2rem;
		font-weight: 400;
		padding-bottom: 1rem;
	}
</style>
