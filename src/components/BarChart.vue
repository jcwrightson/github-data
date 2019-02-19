<template>

	<div class="chart">
	
	<template v-if="results.length">

		<svg xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			xmlns:ev="http://www.w3.org/2001/xml-events"
			:width="`${chart.width}px`" :height="`${chart.height}px`">

			<template v-for="(result, index) in sortByLargestResult">
				<g :key="index">
					<rect class="rect"
					
						:width="`${getWidth()}px`" 
						:height="`${getHeight(result)}px`" 
						:fill="getGradiatedColor(result)" 
						:y="`${getY(index, result)}px`" 
						:x="`${getX(index)}px`">
					</rect>
					<text class="label"
			
						:width="`${getWidth()}px`" 
						:height="`${getHeight(result)}px`" 
						fill="black" 
						:x="`${getX(index)}px`"
						:y="`${getY(index, result) - 5}px`">
			
						{{result.value}}
					</text>

					<text class="label"
						:key="index"
						:width="`${getWidth()}px`" 
						:height="`${getHeight(result)}px`" 
						fill="black"
						:y="chart.height + 20" 
						:x="`${getX(index)}px`">
			
						{{result.query}}
					</text>
				</g>
				
			</template>

		</svg>
			
	</template>
		
	<template v-else>
			<div>Results Appear Here</div>
	</template>

	</div>

</template>

<script>
export default {
	name: 'BarChart',
	props: ['results', 'chart'],
	computed: {
		sortByLargestResult: function(){
			if(this.results.length){
				
				let results = [...this.results]
				return results.sort((a, b) => b.value - a.value)
			}

			return this.results			
		}
	},
	methods:{
		getWidth(){
			return (this.chart.width / this.results.length) - this.chart.padding
		},
		getHeight(result){

			if(this.results.length < 2){
				return this.chart.height
			}

			let largestResult
			
			if(this.results.length > 1){
				largestResult = this.sortByLargestResult[0].value
			}

			const proportion = largestResult / result.value

			const height = Math.floor(this.chart.height / proportion)

			if (height > 0){
				return height
			}
			
			return 1
		},
		getX(index){
			return (this.getWidth() + this.chart.padding) * index
		},
		getY(index, result){
			return this.chart.height - this.getHeight(result)
		},
		getGradiatedColor(result){
			const proportion = this.chart.height / this.getHeight(result)
			return `hsla(180, 40% ,${80 / proportion}%, 1)`
			// return `hsla(${132}, ${100 / proportion}%, 40%, 1)`
		},
	}
}
</script>

<style lang="scss">

svg{
	.label{
		text-transform: uppercase;
		font-family: monospace;
	}
}

</style>

