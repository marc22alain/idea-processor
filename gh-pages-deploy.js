var ghpages = require('gh-pages');

ghpages.publish('dist', function(err) {
  console.log('Done the deploy to GIthub pages!');
});
