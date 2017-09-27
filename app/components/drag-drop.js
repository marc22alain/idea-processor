import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  tagName: 'button',
  classNames: ['target-button','blue'],
  attributeBindings: ['draggable','droppable'],
  draggable: true,
  droppable: true,
  isTarget: false,
  dragStart(event) {
    event.originalEvent.dataTransfer.setData('parent-node-id', this.get('parentId'));
    event.originalEvent.dataTransfer.setData('grand-parent-node-id', this.get('grandParentId'));
    // console.log('dragStart ' + this.get('parentId') + ' :: ' + this.get('grandParentId'));
  },
  drag() {
    // console.log('drag');
    // console.log('dragStart ' + this.get('model.id'));
  },
  dragEnter() {
    // console.log('dragEnter');
    this.set('isTarget', true);
    // console.log('dragEnter ' + this.get('parentId'));
  },
  dragLeave() {
    // console.log('dragLeave');
    this.set('isTarget', false);
  },
  dragOver(event) {
    // do nothing
    event.originalEvent.preventDefault();
    event.originalEvent.dataTransfer.dropEffect = "move";
  },
  drop(event) {
    event.originalEvent.preventDefault();
    let parentNodeId = event.originalEvent.dataTransfer.getData('parent-node-id');
    let grandParentNodeId = event.originalEvent.dataTransfer.getData('grand-parent-node-id');
    // console.log('DROP: ' + parentNodeId + ' :: ' + grandParentNodeId);
    this.addToNewParentNode(parentNodeId, this.get('parentId'));
    this.removeFromOldParentNode(parentNodeId, grandParentNodeId);
    this.set('isTarget', false);
  },
  addToNewParentNode(ideaNodeId, newParentNodeId) {
    let store = this.get('store');
    let parentNode = store.cache.query(q => q.findRecord({ type: 'ideanode', id: newParentNodeId}));
    let ideaNode = store.cache.query(q => q.findRecord({ type: 'ideanode', id: ideaNodeId}));
    parentNode.get('childnode').pushObject(ideaNode);
    // do nothing yet
  },
  removeFromOldParentNode(ideaNodeId, oldParentNodeId) {
    // do nothing yet
    let store = this.get('store');
    let parentNode = store.cache.query(q => q.findRecord({ type: 'ideanode', id: oldParentNodeId}));
    let ideaNode = store.cache.query(q => q.findRecord({ type: 'ideanode', id: ideaNodeId}));
    parentNode.get('childnode').removeObject(ideaNode);
  }
});
