<template>
  <div class="search">
    <input
      type="text"
      placeholder="term"
      v-model="search.term"
      v-on:keydown="handleKeyDown"
      :class="loading ? 'loading' : ''"
    >
    
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" v-on:click="handleDelete">
      <path
        id="ic_remove_circle_outline_24px"
        d="M7,11v2H17V11Zm5-9A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.011,8.011,0,0,1,12,20Z"
        transform="translate(-2 -2)"
      ></path>
    </svg>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { clearTimeout, setTimeout } from 'timers'

const Query = gql`
	query Search($searchTerm: String!, $searchType: SearchType!) {
		search(type: $searchType, query: $searchTerm) {
			repositoryCount
			userCount
			issueCount
		}
	}
`

export default {
	name: 'Search',
	props: ['searchType', 'index', 'searchTerm', 'scope'],
	data() {
		return {
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
		Search: {
			query: function() {
				return Query
			},
			variables() {
				return {
					searchTerm:
						this.scope !== 'literal'
							? `${this.scope}:"${this.search.term}"`
							: `"${this.search.term}"`,
					searchType: this.searchType
				}
			},
			deep: false,
			update(data) {
				return data
			},
			result({ data, loading }) {
				this.search.results =
					data.search.repositoryCount ||
					data.search.userCount ||
					data.search.issueCount ||
					0

				this.loading = loading

				this.$emit('result', {})

				this.$store.dispatch('HANDLE_RESULT', {
					query: this.search.term,
					type: this.searchType,
					value: this.search.results,
					index: this.index,
					loading
				})
			},
			error(error) {
				console.error('Oops...', error)
			},
			skip() {
				//Allow disable / enable fetching
				return this.skipQuery
			}
		}
	},
	methods: {
		handleSearch() {
			this.triggerQuery()
		},
		triggerQuery() {
			this.loading = true
			this.$emit('loading', {})

			//Enable fetching
			this.$apollo.queries.Search.skip = false

			//Fetch data
			this.$apollo.queries.Search.refetch()
		},
		handleKeyDown(e) {
			if (e.key !== 'Tab') {
				if (this.debounce) {
					clearTimeout(this.debounce)
				}

				this.debounce = setTimeout(() => {
					this.handleSearch()
				}, 500)
			}
		},
		handleDelete() {
			this.$emit('delete', {
				query: this.search.term,
				type: this.searchType,
				value: this.search.results,
				index: this.index,
				deleted: true
			})
		}
	},
	watch: {
		searchTerm: function(updated) {
			this.search = { ...this.search, term: updated }
			this.handleSearch()
		}
	},
	created() {
		if (this.searchTerm) {
			this.search = { ...this.search, term: this.searchTerm }
			this.handleSearch()
		}
	}
}
</script>

<style lang="scss" scoped>
.search {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	color: white;

	&:hover {
		svg {
			display: block;
		}
	}

	svg {
		width: 24px;
		height: 24px;
		fill: currentColor;
		margin-bottom: 0.5rem;
		margin-left: 0.5rem;
		cursor: pointer;
		display: none;
	}

	input.loading {
		background-color: white;
		color: black;
	}
}
</style>

