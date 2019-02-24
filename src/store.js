import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const datasets = require('@/assets/datasets.json')

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
				active: true
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
		}
	},
	actions: {}
})
