import IndexedDBSource from '@orbit/indexeddb';

export default {
  create(injections = {}) {
    injections.name = 'backup';
    injections.namespace = 'idea-processor';
    return new IndexedDBSource(injections);
  }
};
