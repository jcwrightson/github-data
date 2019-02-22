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
          <g :key="index" requiredFeatures="http://www.w3.org/Graphics/SVG/feature/1.2/#TextFlow">
            <rect class="rect" :width="`${getWidth()}px`" :fill="getGradiatedColor(result)"></rect>

            <text
              class="label value"
              height="20px"
              :width="`${getWidth()}px`"
              :x="`${getX(index)}px`"
            >{{result.value}}</text>

            <foreignObject
              class="label title"
              :x="`${getX(index)}px`"
              :y="chart.height + 10"
              :width="`${getWidth()}px`"
              height="130px"
              requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
            >
              <p xmlns="http://www.w3.org/1999/xhtml">{{result.query}}</p>
            </foreignObject>
          </g>
        </template>
      </svg>
    </template>
  </div>
</template>

<script>
import { TweenLite } from 'gsap'
const TweenMax = TweenLite

export default {
	name: 'BarChart',
	props: ['results', 'chart', 'loading'],
	computed: {
		sortByLargestResult: function() {
			if (this.results.length) {
				let results = [...this.results]
				return results.sort((a, b) => b.value - a.value)
			}

			return this.results
		}
	},
	methods: {
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

			let largestResult

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
					y: `${this.getY(index, result)}px`
				}).delay(0.5)
				TweenMax.to(bar[index], 1, {
					x: `${this.getX(index)}px`
				}).delay(0.5)

				TweenMax.to(value[index], 1, {
					y: `${this.getY(index, result) - 10}px`
				}).delay(0.5)
				TweenMax.to(title[index], 2, { opacity: 1 }).delay(1)
				TweenMax.to(value[index], 2, { opacity: 1 }).delay(2)
			})
		},
		tweenedResult: x => {
			// return Tween(0, x, 2)
		}
	},
	mounted() {
		this.animate()
	},
	updated() {
		this.animate()
	},
	created() {}
}
</script>

<style lang="scss">
svg {
	.label {
		text-transform: uppercase;
		font-family: monospace;
		opacity: 0;
		color: black;
	}

	p {
		margin: 0;
		font-size: 0.9rem;
	}

	g:hover {
		.rect{
			fill: #ff9901;
			cursor: pointer;
		}
		.label{
			color: #ff9901;
		}
	}
}
</style>

