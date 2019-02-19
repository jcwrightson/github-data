<template>

	<div class="chart">
	
	<template v-if="results.length">

		<!-- Line -->
		<svg xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			xmlns:ev="http://www.w3.org/2001/xml-events"
			:width="`${chart.width}px`" :height="`${chart.height}px`">

			<defs>
				<linearGradient id="Gradient1" x1="0" y1="0" x2="100%" y2="0">
					<stop offset="0%" stop-color="rgb(184, 224, 224)" />
					<stop offset="100%" stop-color="rgb(0, 0, 0)" />
				</linearGradient>
			</defs>

			<polyline :points="getPolyPoints()" fill="none" stroke="url(#Gradient1)" stroke-width="4" />

			<template v-for="(point, index) in getPoints()">

				<g :key="index" class="point">
					<circle class="dot" :cx="point[0]" :cy="point[1]" r="4" stroke-width="6" fill="black" stroke="rgba(255,255,255,0)"></circle>
					<text class="label" :x="point[0] - 80" :y="point[1] + 35">{{sortByLargestResult[index].value}}</text>
					<text class="label" :x="point[0] - 80" :y="point[1] + 20">{{sortByLargestResult[index].query}}</text>
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
	name: 'LineChart',
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
		getPolyPoints(){

			let s = '' 

			// SVG's polyline requires a string of format 'x,y x,y x,y...'
			this.getPoints().map(coords => {
				s = `${s}${coords[0]}, ${coords[1]} `
			})

			return s
		},
		getPoints(){
			return[...this.sortByLargestResult.map((result, index) => {
				if(index === 0){
					return [this.getX(index), Math.abs(this.getHeight(result) - this.chart.height)]
				}else{
					return [(this.getX(index) + (this.getX(index) * 0.25)), Math.abs(this.getHeight(result) - this.chart.height)]
				}
			})]
		},
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

			return Math.floor(this.chart.height / proportion)
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

<style lang="scss" scoped>

.container{
	&.results{
		flex-basis: 85%;
		flex-direction: column;
	}
}

.point:hover{


	cursor: pointer;

	.dot{
		transition: all 200ms ease-in-out;
		stroke: black;
	}

	.label{
		// opacity: 1;
	}
}

.label{
	transition: all 200ms ease-in-out;
	// opacity: 0;
}
</style>

