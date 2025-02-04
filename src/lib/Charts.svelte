<script>
	import { onMount } from 'svelte';
	// -- Components Carbon
	import { DonutChart } from '@carbon/charts-svelte';
	// -- Stores
	import { metric1Order } from './js/store.js';

	let data = [];

	let options = {
		title: 'Ventas por Condición Fiscal',
		resizable: true,
		toolbar: {
			enabled: false
		},
		legend: {
			alignment: 'center',
			orientation: 'vertical'
		},
		donut: {
			alignment: 'center',
			center: {
				label: 'Ventas'
			}
		},
		color: {
			pairing: {
				option: 1
			}
		},
		height: '500px'
	};

	$: data = [
		{
			group: 'Resp. Inscripto',
			value: $metric1Order.ri
		},
		{
			group: 'Monotributista',
			value: $metric1Order.mt
		},
		{
			group: 'Consumidor Final',
			value: $metric1Order.cf
		},
		{
			group: 'Iva Excento',
			value: $metric1Order.ie
		},
		{
			group: 'Consumidor Final - Mat. Primas',
			value: $metric1Order.cfm
		},
		{
			group: 'Presupuesto',
			value: $metric1Order.p
		}
	];
</script>

<div class="chart-container">
	<DonutChart {data} {options} />
</div>

<style>
	.chart-container {
		justify-content: center;
		align-items: center;
		/* border: 1px solid #ccc;
		border-radius: 8px; */
		padding-top: 2rem;
		padding-bottom: 2rem;
		padding-left: 2rem;
		padding-right: 2rem;
		background-color: rgba(255, 255, 255, 0);
		backdrop-filter: blur(12px) saturate(85%);
		-webkit-backdrop-filter: blur(12px) saturate(85%);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 1rem;
	}

	/* Puedes sobrescribir o añadir estilos específicos si es necesario */
	.chart-container :global(.cds--chart-holder) {
		width: 100%;
	}

	:global(.cds--cc--chart-wrapper p) {
		font-size: 13px !important;
		color: #f7f0f0 !important;
	}

	:global(.cds--cc--chart-wrapper text) {
		font-size: 12px !important;
		fill: #f7f0f0 !important;
	}

	:global(.cds--cc--title p.title) {
		font-size: 18px !important;
	}
</style>
