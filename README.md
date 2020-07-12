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
This widget relies on the Google Civic Data API. A key needs to be provided in order to build. The key is set in the `.env` file. If you don't want to rebuild the files in order to inject a new key, you can provide this bit of code in the html page as early as possible:

```
<script>
window._google_civic_api_key = #######
</script>
```


