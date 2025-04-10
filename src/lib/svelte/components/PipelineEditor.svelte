<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte'
	import type {
		CanvasObject,
		Connection,
		NodeInstance,
		NodeParameter,
		NodeType,
		PortReference,
	} from '$lib/types'
	import { canvasesStore } from '$lib/svelte/stores/canvasStore'
	import Vector2 from '$lib/utils/Vector2'
	import Node from '$lib/svelte/components/Node.svelte'
</script>
