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
  nodeClass: Ember.computed('hasChildren', 'model.showComputed', function() {
    if ((this.get('hasChildren') && !this.get('model.showComputed')) || !this.get('level')) {
      return 'meta-text';
    }
    return 'leaf-text';
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
  levelClass: Ember.computed('level', 'hasChildren', function() {
    if (!this.get('hasChildren') && this.get('level')) {
      return 'nolevel';
    }
    let level = this.get('level');
    if (level > 4) {
      return 'level3';
    }
    return 'level' + level.toString();
  }),
  sortedChildren: Ember.computed('model.childnode.length', function() {
    let children = this.get('model.childnode');
    if (this.get('sortOrder') === 'recent') {
      return children.sortBy('lastUpdate').reverse();

    }
    return children.sortBy('order');
  }),
  actions: {
    deleteIdea() {
      let doomed = this.get('model');
      if (doomed.get('root') === true) {
        this.sendAction('deleteIdeaNode', doomed);
        this.sendAction('transitionAction');
      }
      this.sendAction('deleteIdeaNode', doomed);
    },
    addIdea() {
      let parent = this.get('model');
      // console.log(parent.get('childnode.length'));
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
          Ember.debug('Failed to add child on UPDATE addRecord: ' + e);
          forkedStore.destroy();});
    },
    toggleChildren() {
      let model = this.get('model');
      model.set('showsChildren', !model.get('showsChildren'));
    }
  },
  didInsertElement() {
    let textArea = this.$('textarea');
    textArea.focus();
  }
});
