import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueApollo from 'vue-apollo'

Vue.config.productionTip = false

const TOKEN = atob(process.env.VUE_APP_TOKEN)

const httpLink = new HttpLink({
	uri: 'https://api.github.com/graphql',
	headers: {
		Authorization: `bearer ${TOKEN}`
	}
})

const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	connectToDevTools: true
})

Vue.use(VueApollo)

const apolloProvider = new VueApollo({
	defaultClient: apolloClient,
	defaultOptions: {
		$loadingKey: 'loading'
	}
})

new Vue({
	router,
	store,
	provide: apolloProvider.provide(),
	render: h => h(App)
}).$mount('#app')
