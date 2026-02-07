import { onBuild, onPostBuild } from '/Users/vincentlli/Documents/demo/netlify/opennext/dist/index.js';

const options = { 
  constants: { PUBLISH_DIR: '.next' }
};

console.log('Starting onBuild...');
await onBuild(options);
console.log('onBuild done.');

console.log('Starting onPostBuild...');
await onPostBuild(options);
console.log('onPostBuild done.');
