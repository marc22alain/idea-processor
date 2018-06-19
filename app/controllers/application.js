/* global $ */
import Ember from 'ember';
import storeToJson from 'idea-processor/utils/store-to-json';

export default Ember.Controller.extend({
  isHome: Ember.computed('currentRouteName', function() {
    if (this.get('currentRouteName') === 'documents') {
      return true;
    } else {
      return false;
    }
  }),
  getRouteIdParam() {
    return this.get('target.currentURL').split('/')[2];
  },
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
    },
    branchFocus() {
      this.transitionToRoute('branch-focus', this.getRouteIdParam());
    },
    recentOrder() {
      this.transitionToRoute('recent-order', this.getRouteIdParam());
    },
    exportAll() {
      let store = this.get('store');
      let status = $('#store-to-json-result');
      storeToJson(store).then((message) => {
        status.text(message);
      })
      .catch(() => {
        status.text('X');
      });

      // store.query(q => q.findRecords('ideanode'))
      //   .then((allNodes) => {
      //     let first = allNodes[1];
      //     console.log(first.get('showsChildren'));
      //     console.log(first.get('showComputed'));
      //     let json = {
      //       'type': first.get('type'),
      //       'id': first.get('id')
      //     };
      //     console.log(json);
      //     console.log(first);
      //   });
    }
  }
});
