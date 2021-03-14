<template>
	<div class="home">
		<template v-if="isLoading">
			<svg
				class="spinner"
				width="100px"
				height="100px"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 100 100"
				preserveAspectRatio="xMidYMid"
				style="background: none;"
			>
				<circle
					cx="50"
					cy="50"
					fill="none"
					stroke="#45a1a1"
					stroke-width="6"
					r="35"
					stroke-dasharray="164.93361431346415 56.97787143782138"
					transform="rotate(29.8836 50 50)"
				>
					<animateTransform
						attributeName="transform"
						type="rotate"
						calcMode="linear"
						values="0 50 50;360 50 50"
						keyTimes="0;1"
						dur="0.4s"
						begin="0s"
						repeatCount="indefinite"
					></animateTransform>
				</circle>
			</svg>
		</template>

		<aside class="container">
			<div class="block">
				<h1>Scope</h1>
				<SelectScopeType />

				<h1>Terms</h1>

				<div class="terms">
					<SearchTerm
						v-for="(term, index) in terms"
						:index="index"
						:key="term.uid"
						:terms="terms"
						:scope="selectedScope"
					/>
				</div>
				<div class="buttons">
					<button v-on:click="handleIncrement">Add Term</button>
				</div>
			</div>
		</aside>

		<main>
			<div class="top row">
				<div class="flex-row">
					<svg
						@click="toggleSideBar"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 19.454 20"
					>
						<path
							id="ic_settings_24px"
							d="M19.43,12.98A7.793,7.793,0,0,0,19.5,12a7.793,7.793,0,0,0-.07-.98l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.46a.5.5,0,0,0-.61-.22l-2.49,1a7.306,7.306,0,0,0-1.69-.98l-.38-2.65A.488.488,0,0,0,14,2H10a.488.488,0,0,0-.49.42L9.13,5.07a7.683,7.683,0,0,0-1.69.98l-2.49-1a.488.488,0,0,0-.61.22l-2,3.46a.493.493,0,0,0,.12.64l2.11,1.65A7.931,7.931,0,0,0,4.5,12a7.931,7.931,0,0,0,.07.98L2.46,14.63a.5.5,0,0,0-.12.64l2,3.46a.5.5,0,0,0,.61.22l2.49-1a7.306,7.306,0,0,0,1.69.98l.38,2.65A.488.488,0,0,0,10,22h4a.488.488,0,0,0,.49-.42l.38-2.65a7.683,7.683,0,0,0,1.69-.98l2.49,1a.488.488,0,0,0,.61-.22l2-3.46a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
							transform="translate(-2.271 -2)"
						></path>
					</svg>
					<h1>Github Data &mdash; {{ chartTitle() }}</h1>
				</div>
				<div class="flex-row">
					<div class="selectBox">
						<label>Dataset:</label>
						<SelectDataSet />
					</div>

					<div class="selectBox">
						<label>Type:</label>
						<SelectSearchType />
					</div>

					<div class="selectBox">
						<label>Chart:</label>
						<select v-model="chart.type">
							<option value="bar">Bar - SVG</option>
							<option value="pie">Donut - D3.js</option>
						</select>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 0 24 24"
						width="24"
						class="info"
					>
						<path d="M0 0h24v24H0z" fill="none" />
						<path
							d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
						/>
					</svg>
				</div>
			</div>
			<div class="content">
				<template v-if="results.length">
					<template v-if="chart.type === 'bar'">
						<BarChart
							:chart="chart"
							:loading="loading"
							:results="results"
						/>
					</template>

					<template v-if="chart.type === 'pie'">
						<PieChart
							:chart="chart"
							:loading="loading"
							:results="results"
						/>
					</template>

					<template v-if="chart.type === 'point'">
						<PointChart
							:chart="chart"
							:loading="loading"
							:results="results"
						/>
					</template>
				</template>
				<template v-else>
					<!-- <NoContent/> -->
				</template>
			</div>
		</main>
	</div>
</template>

<script>
import { mapState } from 'vuex'
import SearchTerm from '@/components/SearchTerm'
import BarChart from '@/components/BarChart'
import PieChart from '@/components/PieChart'
import PointChart from '@/components/PointChart'
import SelectDataSet from '@/components/selects/SelectDataSet'
import SelectSearchType from '@/components/selects/SelectSearchType'
import SelectScopeType from '@/components/selects/SelectScopeType'

export default {
	name: 'home',
	components: {
		SearchTerm,
		BarChart,
		PieChart,
		PointChart,
		SelectDataSet,
		SelectSearchType,
		SelectScopeType
	},
	data() {
		return {
			chart: {
				type: 'bar',
				height: 500,
				width: 900,
				padding: 5
			},
			loading: false,
			localResults: []
		}
	},
	computed: {
		...mapState({
			queries: state => state.queries,
			selectedQuery: state => state.search.selectedQuery,
			selectedType: state => state.search.selectedType,
			selectedScope: state =>
				state.queries[state.search.selectedQuery].scope,
			results: state => state.queries[state.search.selectedQuery].results,
			terms: state => state.queries[state.search.selectedQuery].terms
		}),
		isLoading: function() {
			return this.results.filter(result => result.loading).length > 0
		},
		sortByLargestResult: function() {
			const results = this.results
			return results.sort(
				(a, b) =>
					b.value[this.selectedType] - a.value[this.selectedType]
			)
		}
	},
	methods: {
		handleDelete(uid) {
			this.$store.dispatch('HANDLE_DELETE', uid)
		},
		handleLoading() {
			this.loading = true
		},
		handleIncrement() {
			this.$store.commit('newTerm', '')
		},
		// ToDo: Move to VUEX
		toggleSideBar() {
			document.querySelector('aside').classList.toggle('js-active')
			document.querySelector('main').classList.toggle('js-active')
		},
		chartTitle() {
			return `${this.selectedScope.toUpperCase()} by ${this.selectedType.toUpperCase()}`
		}
	},
	mounted() {
		const shim = 500
		const content = document.querySelector('.content')
		const contentWidth = content.clientWidth || content.innerWidth
		this.chart = { ...this.chart, width: contentWidth - shim }
		window.addEventListener('resize', () => {
			this.chart = { ...this.chart, width: contentWidth - shim }
		})
		document.querySelector('.content').addEventListener('click', () => {
			if (
				document.querySelector('aside').classList.contains('js-active')
			) {
				this.toggleSideBar()
			}
		})

		this.$store.commit('updateDataSet', 'languages')
	}
}
</script>

<style lang="scss">
.home {
	min-height: 100vh;
	display: flex;
}

h1.title {
	margin: 5rem 0;
	font-weight: 300;
	font-size: 1rem;
}

h1.name {
	font-size: 1.5rem;
}

aside,
main {
	display: flex;
	flex-direction: column;
	transition: left 200ms ease-in-out;
}

aside.container {
	justify-content: space-between;
	align-items: flex-start;
	width: 350px;
	padding-top: 1.5rem;
}

aside {
	position: fixed;
	min-height: 100vh;
	background-color: rgb(83, 83, 83);
	color: white;
	left: -350px;

	&.js-active {
		left: 0;
	}

	input,
	select {
		width: 100%;
		margin-bottom: 0.5rem;

		option {
			color: black;
		}
	}

	.block {
		width: 100%;

		.terms {
			overflow-y: auto;
			max-height: 800px;
			padding-right: 1rem;
		}
	}

	h1:first-of-type {
		margin-top: 0;
	}

	.buttons {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 1rem;
		button {
			flex-basis: 100%;
		}
	}
}

main {
	.container {
		width: auto;
	}

	&.js-active {
		left: 350px;
	}

	position: absolute;
	left: 0;
	width: 100%;
	height: 100%;

	flex-basis: 100%;
}

.chart,
.content {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.7);
	color: #fff;
}

input,
select,
button {
	padding: 0.5rem 0.8rem;
	background-color: transparent;
	border: 1px solid rgba(255, 255, 255, 0.2);
	color: #fff;
	border-radius: 4px;
	font-family: 'Inconsolata';

	option {
		color: black;
	}
}

button {
	background-color: white;
	color: black;
}

.top {
	margin: 0;
	background-color: #222;
	padding: 0 2rem;
	color: white;
	svg {
		width: 24px;
		height: 24px;
		fill: currentColor;
		margin-right: 2rem;
		cursor: pointer;
		&.info {
			margin-right: 0;
		}
	}

	.selectBox {
		margin-right: 2rem;

		label {
			padding-right: 1rem;
		}
	}
}

.spinner {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 1000;
	width: 35px;
}

svg {
	overflow: visible;
}
</style>
