import Ember from 'ember';

export default Ember.Component.extend({
  attributeBindings: ['style'],
  isTarget: false,
  style: Ember.computed('level', function() {
    return Ember.String.htmlSafe('z-index:' + this.get('level') + ';position:relative');
  }),
  targetClass: Ember.computed('isTarget', function() {
    if (this.get('isTarget')) {
      return 'target-on';
    }
    return 'target-off';
  }),

  store: Ember.inject.service(),
  isNotShrunk: Ember.computed('model.shrink', function() {
    if (this.get('model.shrink')) {
      return '5';
    } else {
      return '1';
    }
  }),
  hasChildren: Ember.computed('model.childnode.length', function() {
    return this.get('model.childnode.length') > 0;
  }),
  ruledClass: Ember.computed('hasChildren', 'model.showsChildren', function() {
    if (this.get('hasChildren') && this.get('model.showsChildren')) {
      return 'overruled indent';
    }
    return 'indent';
  }),
  showChildren: Ember.computed('model.showsChildren', function() {
    return this.get('model.showsChildren');
  }),
  computedText: Ember.computed('model.childnode.length', 'model.metaText', function() {
    // console.log('computing computedText');
    let children = this.get('model.childnode');
    let fullText = '';
    if (children.get('length') > 0) {
      children.forEach(function(child) {
        // console.log(child);
        if (child.get('display')) {
          let childText = child.get('computedText');
          if (!childText) {
            childText = child.get('metaText');
          }
          if (childText) {
            fullText += childText;
            fullText += ' ';
          }
        }
      });
    } else {
      fullText = this.get('model.metaText');
    }
    this.set('model.computedText', fullText);
    return fullText;
  }),
  nextlevel: Ember.computed('level', function() {
    return this.get('level') + 1;
  }),
  levelClass: Ember.computed('level', function() {
    let level = this.get('level');
    if (level > 4) {
      return 'level3';
    }
    return 'level' + level.toString();
  }),
  actions: {
    deleteIdea() {
      let doomed = this.get('model');
      if (doomed.get('root') === true) {
        doomed.remove();
        this.sendAction('transitionAction');
      }
      doomed.remove();
    },
    addIdea() {
      let parent = this.get('model');
      console.log(parent.get('childnode.length'));
      let newIdea = {
        type: 'ideanode',
        attributes: {
          parentnode: parent.id,
          order: 1,
          text: '',
          root: false,
          display: true
        }
      };
      let store = this.get('store');
      let forkedStore = store.fork();
      forkedStore.update(t => t.addRecord(newIdea))
        .then((record) => {
          let parentTypeId = { type: 'ideanode', id: parent.get('id')};
          forkedStore.update(t => t.addToRelatedRecords(parentTypeId, 'childnode', record))
            .then(() => {
              store.merge(forkedStore)
                .then(() => {
                  Ember.debug('Added child on merge');
                  forkedStore.destroy();
                  this.set('model.showsChildren', true);})
                .catch((e) => {
                  Ember.debug('Failed to add child on MERGE: ' + e);
                  forkedStore.destroy();});
            })
            .catch((e) => {
              Ember.debug('Failed to add child on UPDATE relatedRecord: ' + e);
              forkedStore.destroy();});
        })
        .catch((e) => {
          Ember.debug('Failed to add child on UPDATE addRecord: ');
          console.log(e);
          forkedStore.destroy();});
    },
    toggleChildren() {
      let model = this.get('model');
      model.set('showsChildren', !model.get('showsChildren'));
    }
  },
  didInsertElement() {
    let textArea = this.$('.metaText');
    textArea.focus();
  }
});
