<template>

	<div class="chart">
	
	<template v-if="results.length">

		<h1>Repositories</h1>

		<!-- Line -->
		<svg xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			xmlns:ev="http://www.w3.org/2001/xml-events"
			:width="`${chart.width}px`" :height="`${chart.height}px`">

			<polyline :points="getPolyPoints()" fill="white" stroke="cadetblue" stroke-width="2" />

			<template v-for="(point, index) in getPoints()">

				<g :key="index" class="point">
					<circle class="dot" :cx="point[0]" :cy="point[1]" r="4" stroke-width="8" fill="red" stroke="rgba(255,255,255,0)"></circle>
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
		getPolyPoints(){

			let s = '' 

			const arr =  [...this.sortByLargestResult.map((result, index) => {
				return [this.getX(index), Math.abs(this.getHeight(result) - this.chart.height)]
			})]

			// SVG's polyline requires a string of format 'x,y x,y x,y...'
			arr.map(coords => {
				s = `${s}${coords[0]}, ${coords[1]} `
			})

			return s
		},
		getPoints(){
			return[...this.sortByLargestResult.map((result, index) => {
				return [this.getX(index), Math.abs(this.getHeight(result) - this.chart.height)]
			})]
		},
		getWidth(){
			return (this.chart.width / this.results.length) - this.chart.padding
		},
		getHeight(result){
			let largestResult = this.chart.height
			
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
			return `hsla(${10}, ${100 / proportion}%, 40%, 1)`
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

