<template>
  <select @change="changeSearchType">
    <option v-for="(type, index) in searchTypes" :value="type" :key="index">{{type}}</option>
  </select>
</template>

<script>
import store from '@/store'
export default {
	name: 'SelectSearchType',
	computed: {
		searchTypes() {
			return store.state.search.searchTypes
		}
	},
	methods: {
		changeSearchType(e) {
			this.$store.commit('changeSearchType', e.target.value)
		}
	}
}
</script>
