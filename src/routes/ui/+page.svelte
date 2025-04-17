<script lang="ts">
	import Button from '$lib/svelte/components/ui/Button.svelte'
	import CheckBox from '$lib/svelte/components/ui/Checkbox.svelte'
	import TextField from '$lib/svelte/components/ui/TextField.svelte'
	import Spinner from '$lib/svelte/components/ui/Spinner.svelte'
	import Dropdown from '$lib/svelte/components/ui/Dropdown.svelte'

	let isChecked = true
	let isIndeterminate = false

	let selectedCountry = ''

	const countries = [
		{ value: 'au', label: 'Australia' },
		{ value: 'ca', label: 'Canada' },
		{ value: 'uk', label: 'United Kingdom' },
		{ value: 'nz', label: 'New Zealand' },
	]

	const groupedCountries = [
		{
			type: 'group',
			label: 'Northern Hemisphere',
			options: [
				{ value: 'ca', label: 'Canada' },
				{ value: 'uk', label: 'United Kingdom' },
			],
		},
		{
			type: 'group',
			label: 'Southern Hemisphere',
			options: [
				{ value: 'au', label: 'Australia' },
				{ value: 'nz', label: 'New Zealand' },
			],
		},
	]
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
	<h2>Checkboxes</h2>
	<div class="groups">
		<div class="button-container sub-container">
			<div class="sub-sub-container">
				<CheckBox label="Standard" />
			</div>
			<div class="sub-sub-container">
				<CheckBox indeterminate label="Indeterminate" />
			</div>
			<div class="sub-sub-container">
				<CheckBox disabled checked label="Disabled" />
			</div>
			<div class="sub-sub-container">
				<CheckBox size="small" label="Small" />
			</div>
			<div class="sub-sub-container">
				<CheckBox size="large" label="Large" />
			</div>
			<div class="sub-sub-container">
				<CheckBox accent label="Accent" />
			</div>
			<div class="sub-sub-container">
				<CheckBox bind:checked={isChecked}>
					<span>Bind: {isChecked ? 'Checked' : 'Unchecked'}</span>
				</CheckBox>
			</div>
			<div class="sub-sub-container">
				<CheckBox bind:indeterminate={isIndeterminate}>Indeterminate bind</CheckBox>
				<Button
					appearance="subtle"
					size="small"
					on:click={() => (isIndeterminate = !isIndeterminate)}
				>
					Toggle indeterminate
				</Button>
			</div>
		</div>
	</div>
	<h2>Text Fields</h2>
	<div class="groups">
		<div class="button-container sub-container">
			<div class="sub-sub-container">
				<TextField disabled />
			</div>
			<div class="sub-sub-container">
				<TextField label="Labelled text field:" />
			</div>
			<div class="sub-sub-container">
				<TextField required error="This field contains an error" size="small" />
			</div>
			<div class="sub-sub-container">
				<TextField size="large" />
			</div>
			<div class="sub-sub-container">
				<TextField placeholder="placeholder" />
			</div>
		</div>
	</div>

	<h2>Number Spinners</h2>
	<div class="groups">
		<div class="button-container sub-container">
			<div class="sub-sub-container">
				<Spinner fitToMaxValue min={-1} max={5} />
			</div>
			<div class="sub-sub-container">
				<Spinner error="Please enter a number" label="Quantity" min={0} max={10} />
			</div>
			<div class="sub-sub-container">
				<Spinner min={-10} max={-2} value={-4} size="small" />
			</div>
			<div class="sub-sub-container">
				<Spinner min={0} max={10} size="large" />
			</div>
			<div class="sub-sub-container">
				<Spinner fitToMaxValue min={0} max={100} />
			</div>
		</div>
	</div>

	<h2>Dropdowns</h2>
	<div class="groups">
		<div class="button-container sub-container">
			<div class="sub-sub-container">
				<Dropdown
					label="Simple Countries Dropdown"
					options={countries}
					bind:value={selectedCountry}
					placeholder="Select a country"
				/>
			</div>
			<div class="sub-sub-container">
				<Dropdown
					label="Group Countries Dropdown"
					options={groupedCountries}
					bind:value={selectedCountry}
					placeholder="Select a country"
				/>
			</div>
			<div class="sub-sub-container">
				<Dropdown
					size="small"
					options={countries}
					bind:value={selectedCountry}
					placeholder="Select a country"
				/>
			</div>
			<div class="sub-sub-container">
				<Dropdown
					size="large"
					options={countries}
					bind:value={selectedCountry}
					placeholder="Select a country"
				/>
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
		height: 50px;
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
