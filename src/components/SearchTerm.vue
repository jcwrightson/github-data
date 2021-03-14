<template>
	<div class="search">
		<input
			type="text"
			placeholder="term"
			v-model="terms[index].value"
			v-on:keydown="handleKeyDown"
			:class="loading ? 'loading' : ''"
		/>

		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			v-on:click="handleDelete"
		>
			<path
				id="ic_remove_circle_outline_24px"
				d="M7,11v2H17V11Zm5-9A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.011,8.011,0,0,1,12,20Z"
				transform="translate(-2 -2)"
			></path>
		</svg>
		<Search
			:key="`REPO_${terms[index].uid}`"
			:uid="terms[index].uid"
			searchType="REPOSITORY"
			:searchTerm="terms[index].value"
			:scope="scope"
		/>
		<Search
			:key="`USER_${terms[index].uid}`"
			:uid="terms[index].uid"
			searchType="USER"
			:searchTerm="terms[index].value"
			:scope="scope"
		/>
		<Search
			:key="`ISSUE_${terms[index].uid}`"
			:uid="terms[index].uid"
			searchType="ISSUE"
			:searchTerm="terms[index].value"
			:scope="scope"
		/>
	</div>
</template>

<script>
import { clearTimeout, setTimeout } from 'timers'
import Search from '@/components/Search'
export default {
	name: 'SearchTerm',
	components: {
		Search
	},
	props: ['terms', 'index', 'scope'],
	data() {
		return {
			debounce: null,
			loading: false
		}
	},

	methods: {
		handleKeyDown(e) {
			if (e.key !== 'Tab') {
				if (this.debounce) {
					clearTimeout(this.debounce)
				}

				this.loading = true

				this.debounce = setTimeout(() => {
					this.loading = false
				}, 800)
			}
		},
		handleDelete() {
			this.$store.dispatch('HANDLE_DELETE', this.terms[this.index].uid)
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
