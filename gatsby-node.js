const crypto = require('crypto');
var nanoid = require('nanoid')
const fetch = require(`./fetch`)
const normalize = require(`./normalize`)

const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

function getDescendantProp(obj, desc) {
  var arr = desc.split(".");
  while(arr.length && (obj = obj[arr.shift()]));
  return obj;
}

exports.sourceNodes = async ({
  boundActionCreators,
  store,
  cache
}, {
  name,
  uri
}) => {
  const { createNode, createParentChildLink } = boundActionCreators;

  // Create nodes here by downloading data
  // from a remote API.
  console.log("Fetching JSON Data")
  let data = await fetch({uri})

  entities = normalize.standardizeKeys(data)

  // Process data into nodes.
  for (const document of entities) {
    // Add the document
    try {
      await createNode({
        ...document,
        id: nanoid(),
        parent: null,
        children: [],
        mediaType: 'application/json',
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

  console.log("\nFinished JSON")
  return;
};

exports.onCreateNode = async ({ node, boundActionCreators, store, cache }, {image_location = 'image.url'}) => {
  // if (node.internal.type !== "DogImage") {
  //   return
  // }

  const url = getDescendantProp(node, image_location)

  const { createNode } = boundActionCreators

  const fileNode = await createRemoteFileNode({
    url: url,
    store,
    cache,
    createNode,
    createNodeId: `image-sharp-${nanoid()}`,
  })

  if (fileNode) {
    node.image___NODE = fileNode.id
  }
}
