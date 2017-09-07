import Ember from 'ember';

export default Ember.Controller.extend({
  isHome: Ember.computed('currentRouteName', function() {
    if (this.get('currentRouteName') === 'documents') {
      return true;
    } else {
      return false;
    }
  }),
  actions: {
    makeNew() {
      Ember.debug('Make a root node');
      let rootnode = {
        type: 'ideanode',
        attributes: {
          order: 0,
          metaText: 'New document',
          computedText: '',
          root: true,
          display: true,
          showsChildren: true
        }
      };
      this.store.update(t => t.addRecord(rootnode))
        .then((record) => {
          let newDoc = this.store.cache.query(q => q.findRecord({ type: 'ideanode', id: record.id}));
          this.transitionToRoute('document', newDoc);
        });
    },
    goHome() {
      this.transitionToRoute('documents');
    }
  }
});
