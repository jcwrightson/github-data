<template>
  <div class="chart">
    <div class="line" :style="`width: ${chart.width}px; height: ${chart.height}px`">
      <div
        class="segment"
        v-for="(result, index) in sortBySmallestResult"
        :key="`segment_${result.uid}`"
      >
        <div
          class="point"
          :style="`border: 1px solid ${getColor(index)}; bottom: ${getY(index, result.value[search.selectedType])}px; background-color:${getColor(index)}`"
        ></div>
		<div class="labels">
        <div class="label">{{result.query}}</div>
        <div class="label">{{prettyValue(result.value[search.selectedType])}}</div>
		</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { prettyValue } from '@/assets/utils'

export default {
	name: 'PointChart',
	props: ['loading', 'results'],
	data() {
		return {
			height: 500,
			width: 500,
			radius: 0,
			chart:{
				height: 500,
				width:1000
			}
		}
	},
	computed: {
		...mapState({
			queries: state => state.queries,
			search: state => state.search
		}),
		sortByLargestResult: function() {
			const results = [...this.results]
			return results.sort(
				(a, b) =>
					b.value[this.search.selectedType] -
					a.value[this.search.selectedType]
			)
		},
		sortBySmallestResult: function() {
			const results = [...this.results]
			return results.sort(
				(a, b) =>
					a.value[this.search.selectedType] -
					b.value[this.search.selectedType]
			)
		},

		isLoading: function() {
			return this.results.filter(result => result.loading).length > 0
		}
	},
	methods: {
		prettyValue(value) {
			return prettyValue(value)
		},
		getColor(index) {
			const step = (100 / this.results.length) * index
			// return `hsla(180, 40%, 80%, 1)`
			return `hsla(180, 40%, ${step}%, 1)`
		},

		getX(index) {
			return (this.chart.width / this.results.length) * index
		},
		getY(index, value) {
			let largestResult = 0

			if (this.results.length > 1) {
				largestResult = this.sortByLargestResult[0].value[
					this.search.selectedType
				]
			}

			const proportion = largestResult / value

			return Math.floor(this.chart.height / proportion)
		}
	}
}
</script>
<style lang="scss">
.line {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-end;
	position: relative;

	.segment {
		position: relative;
		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		cursor: pointer;

		&:hover {
			.point {
				background-color: #ff9901 !important;
				border: 1px solid #fff !important;

				width: 12px;
				height: 12px;
			}

			.label {
				opacity: 1;
				color: #ff9901;
			}
		}
	}
	.labels{
		position: absolute;
		bottom: -60px;
	}
	.label {
		font-family: "Inconsolata", monospace;
		font-size: 0.9rem;
		opacity: 0;
		transition: all 220ms ease-in-out;
	}

	.point {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		position: absolute;
		transition: all 220ms ease-in-out;
		bottom: 0;
	}
}
</style>


