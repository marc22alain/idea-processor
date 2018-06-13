import Ember from 'ember';
import IdeanodeMixin from 'idea-processor/mixins/ideanode';

export default Ember.Component.extend(IdeanodeMixin, {
  attributeBindings: ['style'],
  isTarget: false,
  text: Ember.computed(function() {
    return this.get('model.metaText');
  }),
  style: Ember.computed('level', function() {
    return Ember.String.htmlSafe('z-index:' + this.get('level') + ';position:relative');
  }),
  /* Applies a CSS class to the target for a drag-and-drop operation. */
  targetClass: Ember.computed('isTarget', function() {
    if (this.get('isTarget')) {
      return 'target-on';
    }
    return 'target-off';
  }),
  hasChildren: Ember.computed('model.childnode.length', function() {
    return this.get('model.childnode.length') > 0;
  }),
  /* Applies a CSS class depending whether the node has children, and is required to show them. */
  ruledClass: Ember.computed('hasChildren', 'model.showsChildren', function() {
    if (this.get('hasChildren') && this.get('model.showsChildren')) {
      return 'overruled indent';
    }
    return 'indent';
  }),
  /* Applies a CSS class depending whether the node is a leaf. */
  nodeClass: Ember.computed('hasChildren', 'model.showComputed', function() {
    if ((this.get('hasChildren') && !this.get('model.showComputed')) || !this.get('level')) {
      return 'meta-text';
    }
    return 'leaf-text';
  }),
  displayButtonClass: Ember.computed('model.display', function() {
    if (this.get('model.display')) {
      return 'toggle-button green';
    }
    return 'toggle-button grey'
  }),
  computeButtonClass: Ember.computed('model.showComputed', function() {
    if (this.get('model.showComputed')) {
      return 'toggle-button green';
    }
    return 'toggle-button grey'
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
  /* Applies a CSS class according to the node's position in the tree. */
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
  /* Applies a sorting algorithm to a node's children. */
  sortedChildren: Ember.computed('model.childnode.length', function() {
    let children = this.get('model.childnode');
    if (this.get('sortOrder') === 'recent') {
      return children.sortBy('lastUpdate').reverse();

    }
    return children.sortBy('order');
  }),
  actions: {
    toggleChildren() {
      let model = this.get('model');
      model.set('showsChildren', !model.get('showsChildren'));
    },
    toggleDisplay() {
      let model = this.get('model');
      model.set('display', !model.get('display'));
    },
    toggleComputed() {
      let model = this.get('model');
      model.set('showComputed', !model.get('showComputed'));
    }
  },
  didInsertElement() {
    this._super(...arguments);
    // Must specify `first` in order to ignore child nodes.
    let textArea = this.$('textarea').first();
    textArea.focus();
    // Save the edited text when the textarea loses focus.
    // This will get triggered when the user switches to edit another ideanode, or when the page is left.
    textArea.on('focusout', () => {
      this.set('model.metaText', this.get('text'));
      // TODO: confirm magic number in other browsers, and with other font sizes.
      let magic = 10;
      textArea.css('height', (textArea[0].scrollHeight - magic).toString() + 'px');
    });
  },
  willDestroyElement() {
    this._super(...arguments);
    let textArea = this.$('textarea').first();
    textArea.off('focusout');
  }
});
