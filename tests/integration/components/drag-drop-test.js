import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('drag-drop', 'Integration | Component | drag drop', {
  integration: true,
  beforeEach() {
    this.register('service:store', StubStoreService);
  }
});

let StubStoreService = Ember.Service.extend({
  isHappy: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{drag-drop}}`);

  assert.equal(this.$().text().trim(), 'Move', 'Checking that it shows the button hint text.');
});
