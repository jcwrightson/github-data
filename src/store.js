import Vue from 'vue'
import Vuex from 'vuex'
import { uuidv4 } from '@/assets/utils'

Vue.use(Vuex)

const datasets = require('@/assets/datasets.json')

// Retrofit term uuids
for (const set in datasets) {
	const newTerms = []
	datasets[set].terms.map(term => {
		newTerms.push({ value: term, uid: uuidv4() })
	})
	datasets[set].terms = [...newTerms]
}

export default new Vuex.Store({
	state: {
		queries: { ...datasets },
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
		updateDataSet(state, value) {
			state.search.selectedQuery = value
		},
		updateSearchType(state, value) {
			state.search.selectedType = value
		},
		newTerm(state, value) {
			state.queries[state.search.selectedQuery].terms.push({
				value: value,
				uid: uuidv4()
			})
		},
		updateTerms(state, terms) {
			state.queries[state.search.selectedQuery].terms = [...terms]
		},
		removeTerm(state, uid) {
			state.queries[state.search.selectedQuery].terms = [
				...state.queries[state.search.selectedQuery].terms.filter(
					term => term.uid !== uid
				)
			]
		},
		removeResult(state, uid) {
			state.queries[state.search.selectedQuery].results = [
				...state.queries[state.search.selectedQuery].results.filter(
					result => result.uid !== uid
				)
			]
		},

		changeScopeType(state, value) {
			state.queries[state.search.selectedQuery].scope = value
		},

		toggleModal(state, modal) {
			state.modals[modal].active = !state.modals[modal].active
		},
		UPDATE_RESULT(state, result) {
			let exists = false
			state.queries[state.search.selectedQuery].results.map(r => {
				if (r.uid === result.uid) {
					r.value = { ...r.value, ...result.value }
					r.query = result.query
					r.loading = result.loading
					exists = true
				}
			})

			if (!exists) {
				state.queries[state.search.selectedQuery].results.push(result)
			}
		},
		UPDATE_TERMS(state, result) {
			state.queries[state.search.selectedQuery].terms.filter(
				term => term.uid === result.uid
			)[0].value = result.query
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
		HANDLE_DELETE({ commit }, uid) {
			commit('removeTerm', uid)
			commit('removeResult', uid)
		}
	}
})
