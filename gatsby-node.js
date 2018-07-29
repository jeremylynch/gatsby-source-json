const crypto = require('crypto');
var nanoid = require('nanoid')
const fetch = require(`./fetch`)

const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

exports.sourceNodes = async ({ boundActionCreators, store, cache }, {name, uri, reporter}) => {
  const { createNode, createNodeField } = boundActionCreators;

  // Create nodes here by downloading data
  // from a remote API.
  console.log("Fetching JSON Data")
  let data = await fetch({uri, reporter})
  // Process data into nodes.
  for (const document of data) {
    // Add the file
    const url = document.image.url
    let fileNode
    try {
      fileNode = await createRemoteFileNode({
        url: url,
        store,
        cache,
        createNode
      })
    } catch (error) {
      console.warn('error creating node', error)
    }

    // Add the document
    try {
      await createNode({
        ...document,
        id: nanoid(),
        parent: null,
        children: [fileNode.id],
        internal: {
          type: name,
          contentDigest: crypto
            .createHash(`md5`)
            .update(JSON.stringify(document))
            .digest(`hex`)
        }
      })
    } catch (error) {
      console.warn('error creating node', error)
    }
  }
  console.log("Finished JSON")
  return;
};
