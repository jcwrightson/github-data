import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		queries: {},
		search: {
			searchTypes: ['REPOSITORY', 'USER', 'ISSUE'],
			scopeTypes: ['literal', 'location', 'language', 'license'],
			selectedType: 'REPOSITORY',
			selectedQuery: 'custom'
		},
		modals: {
			EditQuery: {
				active: false
			}
		}
	},
	mutations: {
		changeDataSet(state, value) {
			state.search.selectedQuery = value
		},

		changeSearchType(state, value) {
			state.search.selectedType = value
		},

		changeScopeType(state, value) {
			state.queries[state.search.selectedQuery].scope = value
		},

		toggleModal(state, modal) {
			state.modals[modal].active = !state.modals[modal].active
		},
		QUERIES(state, value) {
			state.queries = { ...value }
		},
		UPDATE_RESULT(state, result) {
			let exists = false
			state.queries[state.search.selectedQuery].results.map(r => {
				if (r.index === result.index) {
					r.value = result.value
					exists = true
				}
			})

			if (!exists) {
				state.queries[state.search.selectedQuery].results.push(result)
			}
		},
		UPDATE_TERMS(state, result) {
			state.queries[state.search.selectedQuery].terms[result.index] =
				result.query
		},
		DELETE_RESULT(state, result) {
			state.queries[result.type].results.splice(result.index, 1)
		},
		DELETE_TERM(state, result) {
			state.queries[state.search.selectedQuery].terms.splice(
				result.index,
				1
			)
		}
	},
	actions: {
		HANDLE_RESULT({ commit, state }, result) {
			commit('UPDATE_RESULT', result)

			// If custom query, remember term
			if (state.search.selectedQuery === 'custom') {
				commit('UPDATE_TERMS', result)
			}
		},
		HANDLE_DELETE({ commit }, result) {
			commit('DELETE_TERM', result)
			commit('DELETE_RESULT', result)
		},
		LOAD_QUERIES({ commit }, payload) {
			commit('QUERIES', payload)
		}
	}
})
