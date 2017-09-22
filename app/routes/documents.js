import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.liveQuery(q => q.findRecords('ideanode')
                                  .filter({attribute: 'root', value: true}));
  },
});
