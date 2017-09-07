import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    console.log(params.metaText);
    if (params.metaText) {
      return this.store.query(q => q.findRecords('ideanode')
                    .filter({ attribute: 'metaText', value: params.metaText}));
    } else if (params.ideanode_id){
      return this.store.query(q => q.findRecord( {type:'ideanode', id:params.ideanode_id} ));
    }
  }
});
