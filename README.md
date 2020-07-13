# legislative-lookup
An configurable embeddable widget used to lookup representatives by address.

## How to install widget on a page
1.) Copy the contents of `/dist` to your server (index.html doesn't need to be copied)

2.) Insert this line of html
```
<div id="lookup-tool-embed"></div>
```

3.) Then include the script anywhere after
```
<script src="js/app.js"></script>
```
---

## How to build this project from scratch
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
---

## Important build note
This widget relies on the Google Civic Data API. A key needs to be provided in order to build. The key is set in the `.env` file. If you don't want to rebuild the project in order to inject a new key, you can provide the api key in the html page as early as possible:

```
<script>
window._google_civic_api_key = #######
</script>
```

This will override whatever key the project was initially built with.


## Error handling
There are two types of errors handled by this application.
1.) Fatal errors - Something went wrong with the query. You can check the exact message by looking at the console.
2.) No results errors - For whatever reason the address queried didn't return any results.

