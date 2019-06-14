<template>
  <div class="chart">
    <template v-if="isLoading">
			<svg class="loading" width="100px"  height="100px"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;"><circle cx="50" cy="50" fill="none" stroke="#333" stroke-width="6" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(29.8836 50 50)"><animateTransform attributeName="transform" type="rotate" calcMode="linear" values="0 50 50;360 50 50" keyTimes="0;1" dur="0.4s" begin="0s" repeatCount="indefinite"></animateTransform></circle></svg>
		</template>
    <template v-if="results.length && !isLoading">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:ev="http://www.w3.org/2001/xml-events"
        :width="`${chart.width}px`"
        :height="`${chart.height}px`"
      >
        <template v-for="(result, index) in sortByLargestResult">
          <g
            :key="`bar_${result.uid}`"
            requiredFeatures="http://www.w3.org/Graphics/SVG/feature/1.2/#TextFlow"
          >
            <rect
              class="rect"
              :width="`${getWidth()}px`"
              :height="getHeight(result)"
              :x="0"
              :y="`${chart.height}px`"
              :fill="getGradiatedColor(result)"
            ></rect>

						<!-- ToDo Title and value have switched places -->

            <text
              class="label value"
              height="20px"
              :width="`${getWidth()}px`"
              :x="`${getX(index)}px`"
              fill="#ff9901"
            >{{result.query}}</text>

            <foreignObject
              class="label title"
              :x="0"
              :y="chart.height"
              :width="`${getWidth()}px`"
              height="160px"
              requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
            >
              <div xmlns="http://www.w3.org/1999/xhtml">{{prettyValue(result.value[search.selectedType])}}</div>
            </foreignObject>
          </g>
        </template>
      </svg>
    </template>
  </div>
</template>

<script>
import { TweenLite } from 'gsap'
import { mapState } from 'vuex'
const TweenMax = TweenLite

export default {
	name: 'BarChart',
	props: ['results', 'chart', 'loading'],
	computed: {
		...mapState({
			queries: state => state.queries,
			search: state => state.search
		}),
		sortByLargestResult: function() {
			const results = this.results
			return results.sort((a, b) => b.value[this.search.selectedType] - a.value[this.search.selectedType])
		},
		isLoading: function() {
			return this.results.filter(result => result.loading).length > 0
		}
	},
	methods: {
		roundToTwo(num) {
			return +(Math.round(num + 'e+2') + 'e-2')
		},
		prettyValue(value) {
			if (value > 1000000) {
				return `${this.roundToTwo(value / 1000000)}m`
			}

			if (value > 1000) {
				return `${this.roundToTwo(value / 1000)}k`
			}

			return `${this.roundToTwo(value)}`
		},
		getWidth() {
			const result =
				this.chart.width / this.results.length - this.chart.padding

			if (result < 0) {
				return 1
			}

			return result
		},
		getHeight(result) {
			if (this.results.length < 2) {
				return this.chart.height
			}

			let largestResult = 0

			if (this.results.length > 1) {
				largestResult = this.sortByLargestResult[0].value[this.search.selectedType]
			}

			const proportion = largestResult / result.value[this.search.selectedType]

			const height = Math.floor(this.chart.height / proportion)

			if (height > 0) {
				return height
			}

			return 1
		},
		getX(index) {
			return (this.getWidth() + this.chart.padding) * index
		},
		getY(index, result) {
			return this.chart.height - this.getHeight(result)
		},
		getGradiatedColor(result) {
			const proportion = this.chart.height / this.getHeight(result)
			return `hsla(180, 40%, ${95 / proportion}%, 1)`
		},
		animate() {
			const bar = document.querySelectorAll('.rect')
			const title = document.querySelectorAll('.label.title')
			const value = document.querySelectorAll('.label.value')

			this.sortByLargestResult.map((result, index) => {
				TweenMax.to(bar[index], 1, {
					height: `${this.getHeight(result)}px`
				}).delay(0.5)
				TweenMax.to(bar[index], 1, {
					y: `${this.getY(index, result) - this.chart.height}px`
				}).delay(0.1)
				TweenMax.to(bar[index], 1, {
					x: `${this.getX(index)}px`
				}).delay(0.5)

				TweenMax.to(value[index], 1, {
					y: `${this.getY(index, result) - 10}px`
				}).delay(0.25)

				TweenMax.to(title[index], 1, {
					x: `${this.getX(index, result)}px`
				}).delay(0.5)
				TweenMax.to(bar[index], 1, { opacity: 1 })
				TweenMax.to(title[index], 2, { opacity: 1 }).delay(0.5)
				TweenMax.to(value[index], 2, { opacity: 1 }).delay(2)
			})
		}
	},
	mounted() {
		if (!this.isLoading) {
			this.animate()
		}
	},
	updated() {
		if (!this.isLoading) {
			this.animate()
		}
	}
}
</script>

<style lang="scss">
svg {
	.label {
		text-transform: uppercase;
		font-family: monospace;
		color: #fff !important;

		&.value {
			display: none;
		}
	}

	foreignObject {
		overflow: visible;
		position: relative;
		color: #fff;
	}
	.rect {
		opacity: 0;
	}

	g:hover {
		cursor: pointer;
		.rect {
			fill: #ff9901;
		}
		.label {
			color: #ff9901;

			&.value {
				display: block;
				color: #ff9901;
			}
		}
	}
}
</style>

