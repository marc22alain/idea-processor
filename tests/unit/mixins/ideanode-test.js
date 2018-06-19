import Ember from 'ember';
import IdeanodeMixin from 'idea-processor/mixins/ideanode';
import { moduleFor, test } from 'ember-qunit';
import createStoreInjections from 'idea-processor/tests/helpers/ember-orbit-store';

// We cannot state `mixin:ideanode` as it does not create a functional test environment.
moduleFor('model:ideanode', 'Unit | Mixin | ideanode', {
  beforeEach() {
    createStoreInjections(this);
  }
});

test('the addIdea method adds a new idea as childnode to the model idea', function(assert) {
  assert.expect(5);
  let done = assert.async();
  let IdeanodeObject = Ember.Object.extend(IdeanodeMixin);
  let store = Ember.get(this, 'store');
  // console.log(store);
  store.update(t => t.addRecord({ type: 'ideanode' }))
    .then((record) => {
      // console.log(record);
      assert.ok(record.id, 'The store added the first record.');
      let newIdeanode = store.cache.query(q => q.findRecord({ type: 'ideanode', id: record.id }));
      assert.equal(newIdeanode.get('childnode.length'), 0, 'The parent record has no children yet.');

      let mixedIn = IdeanodeObject.create({ store: store, model: newIdeanode });
      mixedIn.addIdea = mixedIn.actions.addIdea;
      mixedIn.addIdea();

      // Because `addIdea()` does not return a Promise, and it's async.
      setTimeout(function() {
        let parent, child;
        let allRecords = store.cache.query(q => q.findRecords('ideanode'));
        assert.equal(allRecords.get('length'), 2, 'The new record is now in the store.');

        if (allRecords[0].get('id') === record.id) {
          parent = allRecords[0];
          child = allRecords[1];
        } else {
          parent = allRecords[1];
          child = allRecords[0];
        }
        assert.equal(parent.get('childnode.content')[0].get('id'), child.get('id'), 'The child was correctly assigned to the parent.');
        assert.equal(child.get('parentnode.id'), record.id, 'The parent was correctly assigned to the child.');
        done();
      }, 5);
    })
});

test('the deleteIdea triggers a passed-in action', function(assert) {
  assert.expect(1);
  let IdeanodeObject = Ember.Object.extend(IdeanodeMixin);
  let mixedIn = IdeanodeObject.create({ deleteIdeaNode: 'deleteNode', model: new Ember.Object({root: false}) });
  mixedIn.deleteIdea = mixedIn.actions.deleteIdea;
  mixedIn.sendAction = function(action) {
    assert.equal(action, 'deleteIdeaNode', 'The deleting action got called.');
  }
  mixedIn.deleteIdea();
});
