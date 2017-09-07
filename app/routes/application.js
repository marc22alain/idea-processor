import Ember from 'ember';


const { get, inject } = Ember;

export default Ember.Route.extend({
  dataCoordinator: inject.service(),

  beforeModel() {
  //   // Orbit: restore the data in backup to store.

    const coordinator = get(this, 'dataCoordinator');
    const backup = coordinator.getSource('backup');

    return backup.pull(q => q.findRecords())
      .then(transform => this.store.sync(transform))
      .then(() => coordinator.activate());
  }
});
