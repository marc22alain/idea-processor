import Ember from 'ember';

export default Ember.Controller.extend({
  sortOrder: 'recent',
  actions: {
    /*
      Gets called when a root idea-node is deleted.
    */
    transToHome() {
      this.transitionToRoute('documents');
    }
  }
});
