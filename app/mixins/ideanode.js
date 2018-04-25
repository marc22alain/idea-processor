import Ember from 'ember';

/*
  The ideanode mixin holds code for adding and deleting nodes.
*/
export default Ember.Mixin.create({
  store: Ember.inject.service(),
  actions: {
    deleteIdea() {
      let doomed = this.get('model');
      if (doomed.get('root') === true) {
        this.sendAction('deleteIdeaNode', doomed);
        this.sendAction('transitionAction');
      }
      this.sendAction('deleteIdeaNode', doomed);
    },
    addIdea() {
      let parent = this.get('model');
      let newIdea = {
        type: 'ideanode',
        attributes: {
          parentnode: parent.id,
          order: 1,
          text: '',
          root: false,
          display: true
        }
      };
      let store = this.get('store');
      let forkedStore = store.fork();
      forkedStore.update(t => t.addRecord(newIdea))
        .then((record) => {
          let parentTypeId = { type: 'ideanode', id: parent.get('id')};
          forkedStore.update(t => t.addToRelatedRecords(parentTypeId, 'childnode', record))
            .then(() => {
              store.merge(forkedStore)
                .then(() => {
                  Ember.debug('Added child on merge');
                  forkedStore.destroy();
                  this.set('model.showsChildren', true);
                })
                .catch((e) => {
                  Ember.debug('Failed to add child on MERGE: ' + e.message);
                  forkedStore.destroy();
                });
            })
            .catch((e) => {
              Ember.debug('Failed to add child on UPDATE relatedRecord: ' + e.message);
              forkedStore.destroy();
            });
        })
        .catch((e) => {
          Ember.debug('Failed to add child on UPDATE addRecord: ' + e.message);
          forkedStore.destroy();
        });
    }
  },
});
