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
    Ember.run(() => this._super(attribute, value, options));
  }
});
