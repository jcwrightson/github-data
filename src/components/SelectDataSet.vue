<template>
  <select v-model="selectedQuery">
    <option v-for="(query, index) in queries" :value="query.parent" :key="index">{{query.label}}</option>
  </select>
</template>

<script>
import store from '@/store'
import { mapState } from 'vuex'
export default {
	name: 'SelectDataSet',
	computed: {
		...mapState(['queries', 'search']),
		selectedQuery: {
			set(value) {
				this.$store.commit('changeDataSet', value)
			},
			get() {
				return this.search.selectedQuery
			}
		}
	},
	methods: {}
}
</script>
