import Vue from 'vue'
import Vuex from 'vuex'

const starterQueries = require("@/assets/queries.json");
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    queries : {...starterQueries},
    search: {
      searchTypes: ["REPOSITORY", "USER", "ISSUE"],
      scopeTypes: ["literal", "location", "language", "license"],
      selectedType: "REPOSITORY",
      selectedQuery: "custom"
    },
  },
  mutations: {
    changeDataSet (state, value) {
      state.search.selectedQuery = value
    },
    changeSearchType (state, value) {
      state.search.selectedType = value
    }

  },
  actions: {

  }
})
