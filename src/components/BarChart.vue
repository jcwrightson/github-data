<template>
<div class="container results">
	<template v-if="results.length">

				<h1>Repositories</h1>

				<!-- Bar -->
				<svg xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xmlns:ev="http://www.w3.org/2001/xml-events"
					:width="`${chart.width}px`" :height="`${chart.height}px`">

					<template v-for="(result, index) in sortByLargestResult">

							<rect 
								:key="index"
								:width="`${getWidth()}px`" 
								:height="`${getHeight(result)}px`" 
								:fill="getGradiatedColor(result)" 
								:y="`${getTranslateY(index, result)}px`" 
								:x="`${getTranslateX(index)}px`">
							</rect>
						
					</template>

				</svg>

				<!-- Value -->
				<svg xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xmlns:ev="http://www.w3.org/2001/xml-events"
					:width="`${chart.width}px`" height="15px">

					<template v-for="(result, index) in sortByLargestResult">

							<text 
								:key="index"
								:width="`${getWidth()}px`" 
								:height="`${getHeight(result)}px`" 
								:fill="getGradiatedColor(result)" 
								:x="`${getTranslateX(index)}px`"
								y="10">
					
								{{result.value}}
							</text>
						
					</template>

				</svg>


				<!-- Label -->
				<svg xmlns="http://www.w3.org/2000/svg"
					xmlns:xlink="http://www.w3.org/1999/xlink"
					xmlns:ev="http://www.w3.org/2001/xml-events"
					:width="`${chart.width}px`" height="15px">

					<template v-for="(result, index) in sortByLargestResult">

							<text 
								:key="index"
								:width="`${getWidth()}px`" 
								:height="`${getHeight(result)}px`" 
								:fill="getGradiatedColor(result)"
								y="10" 
								:x="`${getTranslateX(index)}px`">
					
								{{result.query}}
							</text>
						
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
	props: ['results'],
	data(){
		return{
			chart: {
				height: 600,
				width: 800,
				padding: 10
			}
		}
	},
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
			let largestResult = this.chart.height
			
			if(this.results.length > 1){
				largestResult = this.sortByLargestResult[0].value
			}

			const proportion = largestResult / result.value

			return this.chart.height / proportion
		},
		getTranslateX(index){
			return (this.getWidth() + this.chart.padding) * index
		},
		getTranslateY(index, result){
			return this.chart.height - this.getHeight(result)
		},
		getGradiatedColor(result){
			const proportion = this.chart.height / this.getHeight(result)
			return `hsla(${132}, ${100 / proportion}%, 40%, 1)`
		},
	}
}
</script>

<style lang="scss" scoped>

.container{
	&.results{
		flex-basis: 85%;
		flex-direction: column;
	}
}
</style>

