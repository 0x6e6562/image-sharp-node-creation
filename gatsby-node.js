const crypto = require('crypto');
const { fluid } = require(`gatsby-plugin-sharp`);

var cache = {};

exports.onCreateNode = async ({node, getNode, reporter, cache, actions, createNodeId }) => {

  // Cache each FS path so that we can resolve against the contents from the YAML data
  // This is for demo purposes only, in production you would need something more robust
  cache[node.relativePath] = node.id

  if (node.internal.owner === 'gatsby-transformer-yaml') {
    const { feature } = node;
    const { image } = feature;
    const { createNode } = actions;

    const sourceNodeId = cache[image];
    const imageSourceNode = getNode(sourceNodeId);

    const contentDigest = crypto.createHash('md5').update(JSON.stringify(feature)).digest('hex');

    const fluidImage = await fluid({
      file: imageSourceNode,
      reporter,
      cache,
    });

    const resourceNode = {
      ...feature,
      fluid: fluidImage,
      id: createNodeId(`${node.id} >>> Feature`),
      children: [],
      parent: node.id,
      internal: {
        contentDigest,
        type: 'Feature',
      },
    };

    createNode(resourceNode);
  }
}