<template>
  <div id="app">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> | -->
      <!-- <router-link to="/about">About</router-link> -->
    </div>
    <router-view/>
    <div class="madebywrightson">made by <a href="https://jcwrightson.com/">jcwrightson</a></div>
  </div>
</template>

<style lang="scss">
  *{
    box-sizing: border-box;
  }

  .row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  html, body{
    margin: 0;
    padding: 0;
    font-family: monospace;
  }

  .container {
    width: 100%;
    padding: 2rem;
    margin: auto;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  h1{
    font-size: 1.5rem;
  }

  a, a:hover, a:visited{
    color: inherit;
  }

  .madebywrightson{
    position: absolute;
    bottom: 15px;
    right:15px;
  }
</style>
