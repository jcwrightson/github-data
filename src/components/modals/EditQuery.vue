<template>
  <div class="container">
    <div class="block">
      <h1>Scope</h1>
      <select v-model="queries[search.selectedQuery].scope">
        <option v-for="(scope, index) in search.scopeTypes" :key="index" :value="scope">{{scope}}</option>
      </select>

      <h1>Terms</h1>

      <div class="terms">
        <Search
          v-for="(term, index) in queries[search.selectedQuery].terms"
          v-on:delete="handleDelete"
          v-on:loading="handleLoading"
          v-on:result="handleResult"
          :key="index"
          :id="index"
          :searchType="search.selectedType"
          :searchTerm="term"
          :scope="queries[search.selectedQuery].scope"
        />
      </div>
      <div class="buttons">
        <button v-on:click="handleDecrement">-</button>
        <button v-on:click="handleIncrement">+</button>
      </div>
    </div>

    <div class="block">
      <h1>Datasets</h1>
      <SelectDataSet/>
    </div>
  </div>
</template>

<script>
export default {
	name: 'EditQuery'
}
</script>

<style lang="scss" scoped>
</style>
