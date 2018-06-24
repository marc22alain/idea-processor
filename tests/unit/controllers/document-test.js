import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import createEmberOrbitStore from 'idea-processor/tests/helpers/ember-orbit-store';

moduleFor('controller:document', 'Unit | Controller | document', {
  // Specify the other units that are required for this test.
  needs: ['model:ideanode'],
  beforeEach() {
    createEmberOrbitStore(this);
  }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});

test('it deletes all nodes when the root node is deleted', function(assert) {
  let store = Ember.get(this, 'store');
  let controller = this.subject({ store:store });

  store.update(t => [
    t.addRecord({ type:'ideanode' }),
    t.addRecord({ type:'ideanode' }),
    t.addRecord({ type:'ideanode' }),
    t.addRecord({ type:'ideanode' })
  ])
  .then((records) => {
    let allNodes = store.cache.query(q => q.findRecords('ideanode'));
    assert.equal(allNodes.get('length'), 4, 'Checking that all Ideanodes are in the store.');
    store.update(t => [
      t.addToRelatedRecords(
        { type: 'ideanode', id: records[0].id },
        'childnode',
        { type: 'ideanode', id: records[1].id }),
      t.addToRelatedRecords(
        { type: 'ideanode', id: records[1].id },
        'childnode',
        { type: 'ideanode', id: records[2].id }),
      t.addToRelatedRecords(
        { type: 'ideanode', id: records[2].id },
        'childnode',
        { type: 'ideanode', id: records[3].id })
    ]).then(() => {

      let rootNode = store.cache.query(q => q.findRecord({ type:'ideanode', id: records[0].id }));
      rootNode.remove().then(() => {
        allNodes = store.cache.query(q => q.findRecords('ideanode'));
        assert.equal(allNodes.get('length'), 0, 'Checking that all Ideanodes are deleted from the store.');
      })
    })
  })
});
