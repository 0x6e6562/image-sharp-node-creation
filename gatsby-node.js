const crypto = require('crypto');

var cache = {};

exports.onCreateNode = async ({node, getNode, actions, createNodeId }) => {

  // Cache each FS path so that we can resolve against the contents from the YAML data
  // This is for demo purposes only, in production you would need something more robust
  cache[node.relativePath] = node.id

  if (node.internal.owner === 'gatsby-transformer-yaml') {
    const { feature } = node;
    const { image } = feature;
    const { createNode, createParentChildLink } = actions;

    const sourceNodeId = cache[image];
    const imageSourceNode = getNode(sourceNodeId);

    const contentDigest = crypto.createHash('md5').update(JSON.stringify(feature)).digest('hex');

    const resourceNode = {
      ...feature,
      id: createNodeId(`${node.id} >>> Feature`),
      children: [],
      parent: node.id,
      internal: {
        contentDigest,
        type: 'Feature',
      },
    };

    const imageNode = {
      id: createNodeId(`${image} >> ImageSharp`),
      children: [],
      parent: imageSourceNode.id,
      internal: {
        contentDigest: imageSourceNode.internal.contentDigest,
        type: `ImageSharp`,
      },
    }

    createNode(resourceNode);
    createNode(imageNode);

    createParentChildLink({ parent: node, child: imageNode })
  }
}