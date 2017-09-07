import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    makeRoot() {
      Ember.debug('Make a root node');
      let rootnode = {
        type: 'ideanode',
        attributes: {
          order: 0,
          metaText: 'Title',
          computedText: '',
          root: true,
          display: true,
          showsChildren: true
        }
      };
      this.store.update(t => t.addRecord(rootnode));
    }
  }
});
