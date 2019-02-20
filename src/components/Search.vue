<template>

	<div class="search">

		<input type="text" placeholder="term" v-model="search.term" v-on:keydown="handleKeyDown" :class="loading ? 'loading' : ''"/>

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

const Query = gql`query 
	Search($searchTerm: String!, $searchType: SearchType!){
		search(type: $searchType, query: $searchTerm){
			repositoryCount,
			userCount,
			issueCount
	}
}`

export default {
	name: 'Search',
	props:[
		'searchType',
		'index',
		'searchTerm',
		'scope'
	],
	data(){
		return{
			search: {
				term: null,
				skipQuery: true,
				results: null
			},
			debounce: null,
			loading: false
		}
	},
	apollo: {
		// Advanced query with parameters
		// The 'variables' method is watched by vue
		Search:{
			query: function(){
				return Query
				// return  this.searchType === 'REPOSITORY' ? repoCountQuery : userCountQuery
			},
			variables(){
				return {
					searchTerm: this.scope !== 'none' ? `${this.scope}:"${this.search.term}"` : `"${this.search.term}"`,
					searchType: this.searchType,
				}
			},
			deep: false,
			update(data){
				return data
			},
			result ({ data, loading, networkStatus }) {

					
				this.search.results = data.search.repositoryCount || data.search.userCount || data.search.issueCount || 0

				this.loading = loading

				//Pass to parent
				this.$emit('result', {
					query: this.search.term,
					type: this.searchType,
					value: this.search.results,
					index: this.index,
					loading: loading
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

			this.loading = true
			this.$emit('loading', {})

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
	},
	watch: { 
		searchTerm: function(updated, prev){
				  this.search = {...this.search, term: updated }
				  this.handleSearch()
        }
    },
	created(){
		if(this.searchTerm){
			this.search = {...this.search, term: this.searchTerm}
			this.handleSearch()
		}
	}
}
</script>

<style lang="scss" scoped>
.search{
	display: flex;
	flex-direction: row;
	width: 100%;


	input.loading{
		background-color:white;
		color: black
	}
}
</style>

