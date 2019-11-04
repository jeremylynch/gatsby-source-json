Pull data from a JSON API endpoint and turn into gatsby nodes

#### Install
```
npm i gatsby-source-json
```

#### Usage
```js
plugins: [
  resolve: 'gatsby-source-json',
  options: {
    // name the gatsby node
    name: 'Articles',
    // url for JSON endpoint
    uri: 'www.example.com/example.json',
    // Basic Auth if required (optional)
    auth: {
      username: 'userename',
      password: 'password'
    },
    // image location to process images
    image_location: image_location,
  }
]
```
