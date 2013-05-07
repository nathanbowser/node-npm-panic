`Node npm panic`

A simple web app that provides endpoints for Panic's [Status Board](http://panic.com/statusboard/), returning json and csv data for [npmjs.org/](NPM Modules)

```
  node index.js
```

Find the last 10 recently updated npm modules, returned as json (useful for panic tables)

```
  curl localhost:1337/recent.json
```

or

Find the last 10 recently updated npm modules, as csv (useful for panic tables)

```
  curl localhost:1337/recent.csv
```

The numbers of downloads for a module (used for panic charts)

```
  curl localhost:1337/downloads.csv?module=request
```


See more here: https://github.com/nathanbowser/node-npm-panic
