const crypto = require('crypto');
var nanoid = require('nanoid')
const fetch = require(`./fetch`)

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
  uri,
  image_location = 'image.url'
}) => {
  const { createNode } = boundActionCreators;

  // Create nodes here by downloading data
  // from a remote API.
  console.log("Fetching JSON Data")
  let data = await fetch({uri})
  // Process data into nodes.
  for (const document of data) {
    // Add the file

    const url = getDescendantProp(document, image_location)
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

    let ids = []
    if (fileNode) ids.push(fileNode.id)

    // Add the document
    try {
      await createNode({
        ...document,
        id: nanoid(),
        parent: null,
        children: ids,
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
