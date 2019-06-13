<template>
  <select v-model="selectedScope">
    <option v-for="(scope, index) in search.scopeTypes" :key="index" :value="scope">{{scope}}</option>
  </select>
</template>

<script>

import { mapState } from 'vuex'
export default {
	name: 'SelectScopeType',
	computed: {
		...mapState(['queries', 'search']),
		selectedScope: {
			set(value) {
				this.$store.commit('changeScopeType', value)
			},
			get() {
				return this.queries[this.search.selectedQuery].scope
			}
		}
	},
	methods: {}
}
</script>
