# Github Data

This app harnesses the GitHub GraphQL API to search for terms such as programming languages, geographic locations, repo license types, or literal strings and returns the number of repositories, users, or issues that meet this criteria. 

The results are then displayed visually.

DEMO: https://jcwrightson.com/github-data

## Charts

- Bar (SVG)
- Pie / Donut (D3.js)
- Point (CSS) (deprecated)


## Development

Include a `.env.local` file in the project root with a personal access token with public scope:

`VUE_APP_GITHUB_TOKEN=xxxxxxxxxxxxxxxxx`

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
