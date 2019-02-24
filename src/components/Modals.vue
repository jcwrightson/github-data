<template>
  <div v-if="editQueryActive" class="modal edit-query">
    <EditQuery/>
  </div>
</template>

<script>
import store from '@/store'
import EditQuery from '@/components/modals/EditQuery'
export default {
	name: 'Modals',
	components: {
		EditQuery
	},
	computed: {
		editQueryActive() {
			return store.state.modals.EditQuery.active
		}
	},
}
</script>

<style lang="scss" scoped>
</style>

