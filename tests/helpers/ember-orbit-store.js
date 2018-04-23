import Ember from 'ember';
import Orbit  from '@orbit/data';
import { Store, StoreFactory } from 'ember-orbit';
import TestSchemaFactory from './test-schema-factory'

/*
  USAGE:
  The test context is created only once for the module, in the `before()` callback/hook.
  However, the context is not made available there, but in later callbacks/hooks.
  Calling `createEmberOrbitStore()` for every test is required, as the `afterEach()` hook
  tears down the module and deletes the dependency injections.
  While this seems like a lot of computing work, these tests are much faster than acceptance tests.
*/
export default function(app) {
  initialize(app);
}

function initialize(application) {
  Orbit.Promise = Ember.RSVP.Promise;

  application.register('data-schema:main', TestSchemaFactory);
  application.register('data-source:store', StoreFactory);
  application.register('service:store', Store);

  application.registry._typeInjections['data-source'] = [{property: "schema", fullName: "data-schema:main"}];
  application.registry._injections['service:store'] = [{property: "source", fullName: "data-source:store"}];

  application.inject.service('store', 'service:store');
}
