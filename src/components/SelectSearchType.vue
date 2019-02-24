<template>
  <select v-model="selectedType">
    <option v-for="(type, index) in search.searchTypes" :value="type" :key="index">{{type}}</option>
  </select>
</template>

<script>
import store from '@/store'
import { mapState } from 'vuex'
export default {
	name: 'SelectSearchType',
	computed: {...mapState(['search']),
		selectedType: {
			set(value){
				this.$store.commit('changeSearchType', value)
			},
			get(){
				return this.search.selectedType
			}
		}
	}
}
</script>
