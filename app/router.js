import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('documents');
  this.route('document', {
    path: '/document/:ideanode_id'
  });
  this.route('branch-focus', {
    path: '/branch-focus/:ideanode_id'
  });
  this.route('recent-order', {
    path: '/recent-order/:ideanode_id'
  });
});

Router.reopen({
  location: 'hash'
});

export default Router;
