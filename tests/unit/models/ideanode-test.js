import { moduleFor, test } from 'ember-qunit';
// import { users } from 'idea-processor/tests/helpers/mock-data';
import Ember from 'ember';
import createEmberOrbitStore from 'idea-processor/tests/helpers/ember-orbit-store';


moduleFor('model:ideanode', 'Unit | Model | Ideanode', {
  beforeEach() {
    createEmberOrbitStore(this);
  }
});

test('the minimum operation, blank Ideanode', function(assert) {
  let store = Ember.get(this, 'store');
  assert.ok(store, 'Making sure the store is OK');
  store.update(t => t.addRecord({type:'ideanode'}))
    .then((result) => {
      assert.ok(result.id, 'Checking that update() returns');
      let ideas = store.cache.query(q => q.findRecords('ideanode'));
      assert.equal(ideas.length, 1, 'Checking that there is one Ideanode in the store.');
  });
});

test('it deletes all Ideanodes in the subtree of the deleted Ideanode', function(assert) {
  let store = Ember.get(this, 'store');

  store.update(t => [
    t.addRecord({ type:'ideanode' }),
    t.addRecord({ type:'ideanode' }),
    t.addRecord({ type:'ideanode' }),
    t.addRecord({ type:'ideanode' }),
    t.addRecord({ type:'ideanode' }),
    t.addRecord({ type:'ideanode' }),
    t.addRecord({ type:'ideanode' })
  ])
  .then((records) => {
    let allNodes = store.cache.query(q => q.findRecords('ideanode'));
    assert.equal(allNodes.get('length'), 7, 'Checking that all Ideanodes are in the store.');
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
        { type: 'ideanode', id: records[3].id }),
      t.addToRelatedRecords(
        { type: 'ideanode', id: records[3].id },
        'childnode',
        { type: 'ideanode', id: records[4].id }),
      t.addToRelatedRecords(
        { type: 'ideanode', id: records[3].id },
        'childnode',
        { type: 'ideanode', id: records[5].id }),
      t.addToRelatedRecords(
        { type: 'ideanode', id: records[5].id },
        'childnode',
        { type: 'ideanode', id: records[6].id })
    ]).then(() => {

      let rootNode = store.cache.query(q => q.findRecord({ type:'ideanode', id: records[1].id }));
      rootNode.remove().then(() => {
        allNodes = store.cache.query(q => q.findRecords('ideanode'));
        assert.equal(allNodes.get('length'), 1, 'Checking that all but one Ideanodes are deleted from the store.');
      })
    })
  })
});
