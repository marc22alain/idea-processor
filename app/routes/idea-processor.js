import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return Ember.RSVP.hash({
      root: this.store.liveQuery(q => q.findRecords('ideanode')
                  .filter({ attribute: 'root', value: true}))
    });
  },
  setupController(controller, model) {
    // console.log(model.root.get('sourceCache'));
    let size = model.root._sourceCache._records.ideanode.data.size;
    if (size === 0) {
      model.rootPresent = false;
    } else {
      model.rootPresent = true;
    }
    this._super(controller, model);
  }
});
