import Ember from 'ember';
import {
  Model,
  attr,
  hasMany,
  hasOne
} from 'ember-orbit';

export default Model.extend({
  parentnode: hasOne('ideanode', { inverse: 'childnode'}),
  childnode: hasMany('ideanode', { inverse: 'parentnode'}),
  metaText: attr('string'),
  computedText: attr('string'),
  order: attr('integer'),
  root: attr('boolean'),
  display: attr('boolean'),
  shrink: attr('boolean'),
  showsChildren: attr('boolean'),
  showComputed: attr('boolean'),
  lastUpdate: attr('datetime'),


  replaceAttribute(attribute, value, options) {
    if (attribute !== 'lastUpdate') {
      this.set('lastUpdate', new Date());
    }
    // Original `replaceAttribute` is asynchronous, but returns nothing.
    Ember.run(() => this._super(attribute, value, options));
  },

  remove(options) {
    let childNodes = this.get('childnode').get('content');
    let model = this;
    return processRemoves(childNodes).then(() => {
      // Body of original `remove` method:
      const store = Ember.get(this, '_storeOrError');
      return store.update(t => t.removeRecord(model.identity), options);
    });
  }
});

function processRemoves(childNodes) {
  let child = childNodes.pop();
  if (child) {
    return child.remove().then(() => processRemoves(childNodes));
  } else {
    return Ember.RSVP.resolve();
  }
}
