<template>
	<div class="home">
		<div class="container search">
			<h1>Terms</h1>
			<template v-for="(number, index) in comparisons">
				<div :key="index">
					<Search :searchType="searchType" v-on:result="handleResult" :index="index" />
				</div>
			</template>
			<div class="buttons">
				<button v-on:click="handleDecrement">-</button>
				<button v-on:click="handleIncrement">+</button>
			</div>
		</div>

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
	</div>
</template>

<script>

import Search from '@/components/Search'

export default {
	name: 'home',
	components: {
		Search
	},
	data(){
		return{
			searchType: 'REPOSITORY',
			totalResults: 0,
			results: [],
			comparisons: 2,
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
		handleResult(result){

			let exists = this.results.filter(item => item.index === result.index).length === 1

			if(exists){
				this.results = [...this.results.map(item => {
					if(item.index === result.index){
						item = result
					}
					return item
				})]
			}else{

				this.results = [...this.results, result]
			}

		},
		getTotalResults(){

			return this.results.reduce((total, item) => {
				return total + item.value
			}, 0)
		},
		handleIncrement(){
			this.comparisons++
		},
		handleDecrement(){
			if(this.comparisons > 1){
				this.comparisons--

				if(this.results.length > this.comparisons){
					this.results.pop()
				}
			}
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

<style lang="scss">

.home{
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100vw;
}

.container{
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	&.search {
		flex-direction: column;
		justify-content: flex-start;
		padding: 3rem;
		background-color: #2b2b2b;
		min-height: 100vh;
		flex-basis: 15%;
		min-width: 300px;

		h1{
			color: white;
		}

		input{
			width: 100%;
			font-size: 16px;
		}

		input, button{
			padding: .5rem 1rem;
			
		}

		.buttons{
			display: flex;
			flex-direction: row;
			width: 100%;

			button{
				flex-basis: 50%;
			}
		}
	}

	&.results{
		flex-basis: 85%;
		flex-direction: column;
	}
}


</style>

