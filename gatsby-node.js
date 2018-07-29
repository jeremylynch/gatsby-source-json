const axios = require('axios')
const crypto = require('crypto');
var nanoid = require('nanoid')
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

exports.sourceNodes = async ({ boundActionCreators, store, cache }, {name, uri}) => {
  const { createNode, createNodeField } = boundActionCreators;

  // Create nodes here by downloading data
  // from a remote API.
  const data = await axios.get(uri);

  // Process data into nodes.
  for (const document of data.data) {

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
  return;
};
