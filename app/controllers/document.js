import Ember from 'ember';

export default Ember.Controller.extend({
  sortOrder: 'order',
  actions: {
    /*
      Gets called when a root idea-node is deleted.
    */
    transToHome() {
      this.transitionToRoute('documents');
    },
    deleteIdeaNode(ideaNode) {
      let store = this.get('store');
      if (ideaNode.get('parentnode')) {
        store.query(q => q.findRelatedRecord({ type: 'ideanode', id: ideaNode.id}, 'parentnode'))
          .then((node) => {
            node.get('childnode').removeObject(ideaNode)
              .then(() => {
                ideaNode.remove()
                  // eslint-disable-next-line no-console
                  .catch((e) => console.log('DELETE failed at remove()', e));
              })
              // eslint-disable-next-line no-console
              .catch((e) => console.log('DELETE failed at removeObject()', e));
          })
          // eslint-disable-next-line no-console
          .catch((e) => console.log('DELETE failed at findRelatedRecord()', e));
        } else {
          // Is a root node
          ideaNode.remove()
            // eslint-disable-next-line no-console
            .catch((e) => console.log('DELETE failed at remove()', e));
        }
    }
  }
});
