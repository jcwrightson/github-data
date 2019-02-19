<template>
	<div class="home">
		
		<aside class="container">

			

			<div class="block">

			<h1>Terms</h1>

				<template v-for="(term, index) in queries[search.selectedQuery].terms">
					<Search :key="index" :searchType="search.searchType" :searchTerm="term" v-on:result="handleResult" :index="index" />
				</template>

				<div class="buttons">
					<button v-on:click="handleDecrement">-</button>
					<button v-on:click="handleIncrement">+</button>
				</div>

			</div>

			<div class="block">

				<h1>Datasets</h1>

				<select v-model="search.selectedQuery" v-on:change="handleSelectQuery">
					<option :value="query.parent" v-for="(query, index) in queries" :key="index">{{query.label}}</option>
				</select>

			</div>
		</aside>
		
		<main>

		
			<div class="top row">
				<select v-model="search.searchType" v-on:change="handleSelectType">
					<option  v-for="(type, index) in search.searchTypes" :value="type" :key="index">{{type}}</option>
				</select>
				<h1 class="name">Github Data</h1>
				<select v-model="chart.type" v-on:change="handleChartType">
					<option value="bar">Bar</option>
					<option value="line">Line</option>	
				</select>
			</div>

	
		
			<div class="container">
			<template v-if="chart.type === 'bar'">
				<BarChart :chart="chart" :results="queries[search.selectedQuery].results"/>
			</template>

			<template v-if="chart.type === 'line'">
				<LineChart :chart="chart" :results="queries[search.selectedQuery].results"/>
			</template>
			</div>
	
		</main>
			
			
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
			search: {
				searchTypes: ['REPOSITORY', 'USER', 'ISSUE'], 
				searchType: 'REPOSITORY',
				selectedQuery: 'custom'
			},
			queries:{
				custom: {
					parent: 'custom',
					label: 'Custom',
					terms: [''],
					results: []
				},
				frontend: {
					parent: 'frontend',
					label: 'Frontend',
					terms: ['react', 'vue', 'angular', 'jquery', 'backbone', 'ember', 'babel', 'webpack', 'jest', 'mocha', 'firebase', 'docker'],
					results: []
				},
				backend: {
					parent: 'backend',
					label: 'Backend',
					terms: ['java', 'node', 'express', 'spring', 'django', 'flask', 'php', 'laravel', 'python', 'c#', 'ruby', 'go'],
					results: []
				}
			},
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

			// Update Results
			const selectedQuery = this.search.selectedQuery

			let exists = this.queries[selectedQuery].results.filter(item => item.index === result.index).length === 1

			if(exists){
				this.queries[selectedQuery].results = [...this.queries[selectedQuery].results.map(item => {
					if(item.index === result.index){
						item = result
					}
					return item
				})]
			}else{

				this.queries[selectedQuery].results = [...this.queries[selectedQuery].results, result]
			}

			// If custom query, remember terms

			if(selectedQuery === 'custom'){
				this.queries[selectedQuery].terms[result.index] = result.query
			}

		},
		handleIncrement(){
			this.queries[this.search.selectedQuery].terms.push('')
		},
		handleDecrement(){
			if(this.queries[this.search.selectedQuery].terms.length > 1){
				this.queries[this.search.selectedQuery].terms.pop()
				
				if(this.queries[this.search.selectedQuery].results.length > this.queries[this.search.selectedQuery].terms.length){
					this.queries[this.search.selectedQuery].results.pop()
				}
				
			}
		},
		handleChartType(e){
			this.chart = {...this.chart, type: e.currentTarget.value}
		},
		handleSelectQuery(e){

			this.search = {...this.search, selectedQuery: e.currentTarget.value}
			this.queries[e.currentTarget.value].results = []
		},
		handleSelectType(e){

			this.search = {...this.search, searchType: e.currentTarget.value}
		}

	}
}

</script>

<style lang="scss">

.home{
	min-height: 100vh;
	display: flex;

}

h1.name{
	font-size: 1.5rem;

}

aside, main{
	display: flex;
	flex-direction: column;
}

aside.container{
	justify-content: space-between;
	align-items: flex-start;
}

aside{
	flex-basis: 15%;
	min-height: 100vh;
	background-color: #4e4e4e;
	color: white;

	input, select{
		width: 100%;
		

		option{
			color: black;
		}
	}

	

	.block{
		width: 100%;
	}

	.buttons{
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		button{
			flex-basis: 49%;
		}
	}
}

main{
	.container{
		width: auto;
	}

	background-color: #fafafa;
	flex-basis: 85%;
}

input, select, button {
	padding: .6rem 1rem;
	background-color: transparent;
	border: 1px solid white;
	color: white;
	border-radius: 3px;

	option{
		color: black;
	} 
}

button{
	background-color: white;
	color: black;
}



.top {
	margin: 0;
	background-color: #000;
	padding: 2rem;
	color: white;
}

svg{
	overflow: visible;
}


</style>

