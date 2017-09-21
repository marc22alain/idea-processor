import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.liveQuery(q => q.findRecords('ideanode')
                                  .filter({attribute: 'root', value: true}));
  },
  setupController(controller, model) {
    console.log(model.get('content.length'));
    this._super(controller, [{id: 'me'}]);
  }
});
