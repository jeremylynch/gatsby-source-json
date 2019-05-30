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
  actions,
  store,
  cache
}, {
  name,
  uri,
  auth
}) => {
  const { createNode } = actions;

  // Create nodes here by downloading data
  // from a remote API.
  console.log("Fetching JSON Data")
  let data = await fetch({uri, auth})

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

exports.onCreateNode = async ({
  node,
  store,
  cache,
  actions,
  createNodeId
}, {
  image_location = 'image.url',
  name
}) => {
  const { createNode } = actions
  if (node.internal.type === name) {
    let fileNode

    const url = getDescendantProp(node, image_location)

    try {
      fileNode = await createRemoteFileNode({
        url: url,
        store,
        cache,
        createNode,
        createNodeId,
      })
    } catch (e) {
      console.warn('error', e)
    }

    if (fileNode) {
      node.image___NODE = fileNode.id
    }
  }
}
