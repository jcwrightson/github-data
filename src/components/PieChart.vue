<template>
  <div class="chart">
    <svg class="pie">
      <g>
        <g v-for="slice in pie" :key="slice.index" class="slice">
          <path :d="createArc(slice)" :fill="getColor(slice)" :stroke="getColor(slice)"></path>
          <g transform="translate(-20,0)">
            <text class="label" :x="0" :y="0">{{prettyValue(slice.value)}}</text>
            <text class="label" :x="0" :y="10">{{slice.data.query}}</text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
import { mapState } from 'vuex'
import { prettyValue } from '@/assets/utils'

export default {
	name: 'PieChart',
	props: ['chart', 'loading', 'results'],
	data() {
		return {
			height: 500,
			width: 500,
			radius: 0
		}
	},
	computed: {
		...mapState({
			queries: state => state.queries,
			search: state => state.search
		}),
		isLoading: function() {
			return this.results.filter(result => result.loading).length > 0
		},
		pieChart: function() {
			return d3.select('.pie')
		},
		pie: function() {
			return d3.pie().value(d => d.value[this.search.selectedType])(
				this.results
			)
		}
	},
	methods: {
		prettyValue(value) {
			return prettyValue(value)
		},
		getColor(result) {
			const step = (100 / this.results.length) * result.index
			return `hsla(180, 40%, ${95 - step}%, 1)`
		},
		createArc(slice) {
			const arc = d3
				.arc()
				.innerRadius(this.radius * 0.6)
				.outerRadius(this.radius)
				.startAngle(slice.startAngle)
				.endAngle(slice.endAngle)

			return arc()
		},
		init() {
			this.radius = Math.min(this.width, this.height) / 2

			d3.select('.pie')
				.attr('width', this.width)
				.attr('height', this.height)
				.select('g')
				.attr(
					'transform',
					'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
				)
		}
	},
	mounted() {
		this.init()
	}
}
</script>
<style lang="scss">
.label {
	fill: #ff9901;
}
text {
	display: none;
}
.slice:hover {
	path {
		fill: #ff9901;
		stroke: #ff9901;
	}
	text {
		display: block;
	}
}
</style>


