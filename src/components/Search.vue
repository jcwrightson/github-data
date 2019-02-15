<template>

	<div class="search">

		<input type="text" placeholder="term" v-model="search.searchTerm" v-on:keydown="handleKeyDown"/>

	</div>

</template>

<script>

import gql from 'graphql-tag'
import { clearTimeout, setTimeout } from 'timers';

const userCountQuery = gql`query 
	Search($searchTerm: String!, $searchType: SearchType!){
		search(type: $searchType, query: $searchTerm){
			userCount
	}
}`

const repoCountQuery = gql`query 
	Search($searchTerm: String!, $searchType: SearchType!){
		search(type: $searchType, query: $searchTerm){
			repositoryCount
	}
}`

export default {
	name: 'Search',
	props:[
		'searchType',
		'index'
	],
	data(){
		return{
			search: {
				searchTerm: null,
				skipQuery: true,
				results: null
			},
			debounce: null
		}
	},
	apollo: {
		// Advanced query with parameters
		// The 'variables' method is watched by vue
		Search:{
			query: function(){
				return  this.$props.searchType === 'REPOSITORY' ? repoCountQuery : userCountQuery
			},
			variables(){
				return {
					searchTerm: this.search.searchTerm,
					searchType: this.$props.searchType,
				}
			},
			deep: false,
			update(data){
				return data
			},
			result ({ data, loading, networkStatus }) {

					
				this.search.results = data.search.repositoryCount || data.search.userCount || data.search.issueCount

				//Pass to parent
				this.$emit('result', {
					query: this.search.searchTerm,
					type: this.$props.searchType,
					value: this.search.results,
					index: this.$props.index
				})
			},
			error (error) {
				console.error("Oops...", error)
			},
			skip(){

				//Allow disable / enable fetching
				return this.skipQuery
			}
		}
	},
	methods:{
		handleSearch(){
			this.triggerQuery()
		},
		triggerQuery(){

			//Enable fetching
			this.$apollo.queries.Search.skip = false

			//Fetch data
			this.$apollo.queries.Search.refetch()

		},
		handleKeyDown(e){

			if(e.key !== "Tab"){

				if(this.debounce){
					clearTimeout(this.debounce)
				}
			
				this.debounce = setTimeout(()=>{
					this.handleSearch()
				},500)
						
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.search{
	display: flex;
	flex-direction: row;
	margin-bottom: 1rem;
}
</style>

