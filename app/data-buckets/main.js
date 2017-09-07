/* from ember-orbit README */
import IndexedDBBucket from '@orbit/indexeddb-bucket';

export default {
  create() {
    return new IndexedDBBucket({ namespace: 'idea-processor-settings' });
  }
};
