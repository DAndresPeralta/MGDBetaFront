<script>
	import { BarChartSimple } from '@carbon/charts-svelte';

	let data = [
		{
			group: 'Qty',
			value: 65000
		},
		{
			group: 'More',
			value: 29123
		},
		{
			group: 'Sold',
			value: 35213
		},
		{
			group: 'Restocking',
			value: 51213
		},
		{
			group: 'Misc',
			value: 16932
		}
	];

	let options = {
		title: 'Ventas por día',
		resizable: true,
		axes: {
			left: {
				mapsTo: 'value',
				scaleType: 'linear'
			},
			bottom: {
				mapsTo: 'group',
				scaleType: 'labels'
			}
		},
		legend: {
			alignment: 'center',
			orientation: 'vertical'
		},
		toolbar: {
			enabled: false
		},
		height: '400px'
	};
</script>

<div class="chart-container">
	<BarChartSimple {data} {options} />
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
		background-color: transparent;
	}
</style>
