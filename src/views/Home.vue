<template>
	<div class="home">

		<!-- Input -->
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
			<!-- Output -->
			
				<template v-if="chart.type === 'bar'">
					<BarChart :results="results"/>
				</template>

				<template v-if="chart.type === 'line'">
					<LineChart :results="results"/>
				</template>
		
				<template v-if="results.length">
					<div>
						<select v-model="chart.type" v-on:change="handleChartType">
							<option value="bar">Bar</option>
							<option value="line">Line</option>	
						</select>
					</div>
				</template>
		</div>
			
			
	</div>
</template>

<script>

import Search from '@/components/Search'
import BarChart from '@/components/BarChart'
import LineChart from '@/components/LineChart'

export default {
	name: 'home',
	components: {
		Search,
		BarChart,
		LineChart
	},
	data(){
		return{
			searchType: 'REPOSITORY',
			results: [],
			comparisons: 2,
			chart: {
				type: 'bar',
			}
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
		handleChartType(e){
			this.chart = {...this.chart, type: e.currentTarget.value}
		}

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

	h1{
		margin-bottom: 3rem;
	}
}

select{
	padding: .5rem 2rem;
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
		min-height: 100vh;
		justify-content: space-evenly;
		align-items: center;

		h1{
			text-align: center;
		}
		
		
		.chart{
			display: flex;
			flex-direction: column;
		}

		
	}

	
}

svg{
	overflow: visible;
}


</style>

