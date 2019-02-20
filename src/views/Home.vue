<template>
	<div class="home">
		
		<aside class="container">

			<div class="block">

				<h1>Scope</h1>
				<select v-model="queries[search.selectedQuery].scope">
					<option v-for="(scope, index) in search.scopeTypes" :key="index" :value="scope">{{scope}}</option>
				</select>

				<h1>Terms</h1>

				<div class="terms">

				<template v-for="(term, index) in queries[search.selectedQuery].terms">
					<Search v-on:loading="handleLoading" :key="index" :searchType="search.searchType" :searchTerm="term" :scope="queries[search.selectedQuery].scope" v-on:result="handleResult" :index="index" />
				</template>
				</div>
				<div class="buttons">
					<button v-on:click="handleDecrement">-</button>
					<button v-on:click="handleIncrement">+</button>
				</div>
				

			</div>

			<div class="block">

				<h1>Datasets</h1>

				<select v-model="search.selectedQuery">
					<option :value="query.parent" v-for="(query, index) in queries" :key="index">{{query.label}}</option>
				</select>

			</div>
		</aside>
		
		<main>

			<div class="top row">
				<div style="display:flex; flex-direction:row; align-items:center;">
					
					<svg v-on:click="toggleSideBar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12">
						<path id="ic_menu_24px" d="M3,18H21V16H3Zm0-5H21V11H3ZM3,6V8H21V6Z" transform="translate(-3 -6)"/>
					</svg>
					
					<select v-model="search.searchType">
						<option  v-for="(type, index) in search.searchTypes" :value="type" :key="index">{{type}}</option>
					</select>
				</div>

				<h1 class="name">Github Search</h1>

				<select v-model="chart.type">
					<option value="bar">Bar</option>
					<option value="line">Line</option>	
				</select>
			</div>
		
			<template v-if="chart.type === 'bar'">
				<BarChart :chart="chart" :loading="loading" :results="queries[search.selectedQuery].results"/>
			</template>

			<template v-if="chart.type === 'line'">
				<LineChart :chart="chart" :results="queries[search.selectedQuery].results"/>
			</template>

		</main>

	</div>
</template>

<script>

import Search from '@/components/Search'
import BarChart from '@/components/BarChart'
import LineChart from '@/components/LineChart'

const starterQueries = require('@/assets/queries.json')

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
				scopeTypes: ['none', 'location', 'language', 'license'],
				searchType: 'REPOSITORY',
				selectedQuery: 'custom'
			},
			queries:{...starterQueries},
			chart: {
				type: 'bar',
				height: 600,
				width: 900,
				padding: 5
			},
			loading: false
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

			this.loading = result.loading

		},
		handleLoading(){
			this.loading = true
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
		toggleSideBar(){
			document.querySelector('aside').classList.toggle('js-active')
			document.querySelector('main').classList.toggle('js-active')
		}
	},
	mounted(){
		const chart = document.querySelector('.chart')

		this.chart = {...this.chart, width: chart.clientWidth - 300}

		window.addEventListener('resize', ()=>{
			this.chart = {...this.chart, width: chart.clientWidth - 300}
		})

		document.querySelector('.chart').addEventListener("click", ()=>{
			if(document.querySelector('aside').classList.contains('js-active')){
				this.toggleSideBar()
			}
		})
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

	transition: left 200ms ease-in-out;
}

aside.container{
	justify-content: space-between;
	align-items: flex-start;
	width: 300px;
}

aside{
	
	position: fixed;
	min-height: 100vh;
	background-color: #838383;
	color: white;
	left: -300px;

	&.js-active{
		left:0;
	}

	input, select{
		width: 100%;
		margin-bottom: .5rem;

		option{
			color: black;
		}
	}

	.block{
		width: 100%;

		.terms{
			overflow-y: auto;
			max-height: 600px;
		}
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

	&.js-active{
		left: 300px;
	}

	position: absolute;
	left:0;
	width: 100%;
	height: 100%;

	
	flex-basis: 100%;
}

.chart{
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	background-color: #f2f2f2;
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
	background-color: #398585;
	padding: 1rem 2rem;
	color: white;
	svg{
		width: 24px;
		height: 24px;
		fill: currentColor;
		margin-right: 2rem;
		cursor: pointer;
	}
}

svg{
	overflow: visible;
}


</style>

