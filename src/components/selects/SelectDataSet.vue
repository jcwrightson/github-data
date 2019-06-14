<template>
  <select v-model="selectedQuery"  @change="onSelect">
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
	},
	methods:{
		onSelect:function(e){
			if(e.target.value === 'custom'){
				this.toggleSideBar()
			}
		},
		// ToDo: Move to VUEX
		toggleSideBar() {
			document.querySelector('aside').classList.toggle('js-active')
			document.querySelector('main').classList.toggle('js-active')
		},
	}
}
</script>
