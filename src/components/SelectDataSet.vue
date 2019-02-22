<template>
  <select @change="changeDataSet">
    <option v-for="(query, index) in queries" :value="query.parent" :key="index">{{query.label}}</option>
  </select>
</template>

<script>
import store from '@/store'
export default {
	name: 'SelectDataSet',
	computed: {
		queries() {
			return store.state.queries
		}
	},
	methods: {
		changeDataSet(e) {
			this.$store.commit('changeDataSet', e.target.value)
		}
	}
}
</script>
