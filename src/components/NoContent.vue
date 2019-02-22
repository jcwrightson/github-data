<template>
	 <div class="container">
		<h1>Select a dataset to get started</h1>
		<SelectDataSet />
	</div>
</template>
<script>
import SelectDataSet from '@/components/SelectDataSet'
export default {
	name: 'NoContent',
	props: [
		'chart',
		'queries',
		'model'
	],
	components:{
		SelectDataSet
	}
}
</script>
<style lang="scss" scoped>
select{
	color: black;
	border-color: black;
}
</style>
