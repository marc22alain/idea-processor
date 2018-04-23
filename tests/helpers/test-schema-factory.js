import { Schema } from '@orbit/data';
import Ember from 'ember';

import Ideanode from 'idea-processor/models/ideanode';

const models = {
  ideanode: Ideanode
};


export default {
  create(injections = {}) {
    if (!injections.models) {
      const modelSchemas = {};

      let modelNames = Object.keys(models);

      modelNames.forEach(name => {
        let model = models[name];
        modelSchemas[name] = {
          id: Ember.get(model, 'id'),
          keys: Ember.get(model, 'keys'),
          attributes: Ember.get(model, 'attributes'),
          relationships: Ember.get(model, 'relationships')
        };
      });

      injections.models = modelSchemas;
    }
    return new Schema(injections);
  }
}
