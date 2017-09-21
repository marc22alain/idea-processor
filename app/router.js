import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('idea-processor');
  this.route('documents');
  this.route('document', {
    path: '/document/:ideanode_id'
  });
});

export default Router;
