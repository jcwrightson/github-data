<template>
	<div class="home">
		
		<div class="container search">

			<!-- Input -->
			<h1>Terms</h1>
			<template v-for="(number, index) in comparisons">
				<div :key="index">
					<Search :searchType="searchType" :searchTerm="getSearchTerm(index)" v-on:result="handleResult" :index="index" />
				</div>
			</template>
			<div class="buttons">
				<button v-on:click="handleDecrement">-</button>
				<button v-on:click="handleIncrement">+</button>
			</div>
		</div>
		
		<div class="container results">

			<!-- Output -->
			<template v-if="results.length">
				<div class="row">
					<h1>{{this.searchType}} Count</h1>
					<select v-model="chart.type" v-on:change="handleChartType">
						<option value="bar">Bar</option>
						<option value="line">Line</option>	
					</select>
				</div>
			</template>
		
			<template v-if="chart.type === 'bar'">
				<BarChart :chart="chart" :results="results"/>
			</template>

			<template v-if="chart.type === 'line'">
				<LineChart :chart="chart" :results="results"/>
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
			initialTerms: [],
			sampleQueries: {
				frontend: ['react', 'vue', 'angular', 'backbone', 'ember', 'knockout'],
				backend: ['node', 'php', 'python', '.net', 'ruby on rails', 'go']
			},
			results: [],
			comparisons: 2,
			chart: {
				type: 'bar',
				height: 600,
				width: 900,
				padding: 10
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
		getSearchTerm(index){
			return this.initialTerms[index] || null
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

	},
	created(){
		this.initialTerms = this.sampleQueries.frontend
		this.comparisons = this.initialTerms.length
		
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
		justify-content: center;
		align-items: center;
		
		.row{
			width: 900px;
		}

		h1{
			text-align: center;
		}
		
		
		.chart{
			display: flex;
			flex-direction: column;
			background-color: #f2f2f2;
			padding: 4rem 8rem;
			margin: 2rem 0;
		}

		
	}

	
}

svg{
	overflow: visible;
}


</style>

