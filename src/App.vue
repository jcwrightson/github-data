<template>
  <div id="app">
    <router-view/>
    <div class="madebywrightson">
    <a href="https://jcwrightson.com/">madebywrightson</a>
    </div>
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Inconsolata|Roboto:300&display=swap');

* {
	box-sizing: border-box;
}

.row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.flex-row{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

html,
body {
	margin: 0;
	padding: 0;
	font-family: 'Roboto', sans-serif;
  font-weight: 300;
	overflow-x: hidden;
 
}

.container {
	width: 100%;
	padding: 2rem;
	margin: auto;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

h1 {
	font-size: 1.5rem;
  font-weight: 400;
}

a,
a:hover,
a:visited {
	color: inherit;
}

.madebywrightson {
	position: absolute;
	bottom: 15px;
	right: 15px;
  font-size: 11px;
  font-family: 'Inconsolata', monospace;
  color: #fff;
}
</style>
