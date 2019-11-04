Pull data from a JSON API endpoint into graphql

#### Install
```
npm i gatsby-source-json
```

#### Usage
```js
plugins: [
  resolve: 'gatsby-source-json',
  options: {
    // name of data to add to graphql
    name: name,
    // url for JSON endpoint
    uri: `${api_base}${url}`,
    // Basic Auth if required (optional)
    auth: auth,
    // image location to process images
    image_location: image_location,
  }
]
```
