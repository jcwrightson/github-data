<template>
  <select v-model="selectedQuery">
    <option v-for="(query, index) in queries" :value="query.parent" :key="`SQ_${index}`">{{query.label}}</option>
  </select>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'SelectDataSet',
	computed: {
		...mapState(['queries', 'search']),
		selectedQuery: {
			set(value) {
				this.$store.commit('updateDataSet', value)
			},
			get() {
				return this.search.selectedQuery
			}
		}
	}
}
</script>
