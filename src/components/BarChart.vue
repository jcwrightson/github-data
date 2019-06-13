<template>
  <div class="chart">
    <template v-if="results.length">
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
              <div xmlns="http://www.w3.org/1999/xhtml">{{prettyValue(result.value)}}</div>
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
			return results.sort((a, b) => b.value - a.value)
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
				largestResult = this.sortByLargestResult[0].value
			}

			const proportion = largestResult / result.value

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
			return `hsla(180, 40%, ${80 / proportion}%, 1)`
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
				TweenMax.to(title[index], 2, { opacity: 1 }).delay(.5)
				TweenMax.to(value[index], 2, { opacity: 1 }).delay(2)
			})
		}
	},
	mounted() {
		this.animate()
	},
	updated() {
		this.animate()
	}
}
</script>

<style lang="scss">
svg {
	.label {
		text-transform: uppercase;
		font-family: monospace;
		// opacity: 1;
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

	p {
		margin: 0;
		font-size: 0.9rem;
		z-index: 100;
		transform: rotate(90deg);
		// width: 200px;
		opacity: 0;
		
	}
	.rect {
		opacity: 0;
	}

	g:hover {
		cursor: pointer;
		.rect {
			fill: #ff9901;
			// opacity: 0;
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

