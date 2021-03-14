<template>
	<div></div>
</template>
<script>
import gql from 'graphql-tag'

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
	props: ['searchType', 'index', 'searchTerm', 'scope', 'uid'],
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
				this.loading = loading
				this.search.results =
					data.search.repositoryCount ||
					data.search.userCount ||
					data.search.issueCount ||
					0

				this.$store.dispatch('HANDLE_RESULT', {
					query: this.search.term,
					type: this.searchType,
					value: {
						[this.searchType]: this.search.results
					},
					uid: this.uid,
					loading: false
				})
			},
			error(error) {
				throw error
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

			this.$store.dispatch('HANDLE_RESULT', {
				query: this.search.term,
				type: this.searchType,
				value: {
					[this.searchType]: 0
				},
				uid: this.uid,
				loading: true
			})

			//Enable fetching
			this.$apollo.queries.Search.skip = false

			//Fetch data
			this.$apollo.queries.Search.refetch()
		}
	},
	watch: {
		searchTerm: function(updated) {
			this.search = { ...this.search, term: updated }
			this.handleSearch()
		}
	},
	mounted() {
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
