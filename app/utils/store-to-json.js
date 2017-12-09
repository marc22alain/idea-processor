import Ember from 'ember';

/*
  NOTES:
  - a hasOne relationship results in the related node being stored as a simple attribute, with its id as the value.

  Use: https://github.com/eligrey/FileSaver.js/
  Ref: https://spin.atomicobject.com/2014/02/05/generate-files-javascript-ember-js/
*/

var model;

export default function storeToJson(store) {
  extractModel(store);
  store.query(q => q.findRecords('ideanode'))
        // .then((allNodes) => {
        //   let first = allNodes[4];
        //   let json = {
        //     'type': first.get('type'),
        //     'id': first.get('id')
        //   };
        //   addAttributes(json, first);
        //   addRelationships(json, first);
        //   console.log(json);
        //   console.log(first);
        //   console.log(first.get('childnode'));
        //   console.log(first.get('childnode')._content);
        // });
        .then((allNodes) => {
          let allJson = {'data':[]};
          allNodes.forEach(function(node) {
            let json = {
              'type': node.get('type'),
              'id': node.get('id')
            };
            addAttributes(json, node);
            addRelationships(json, node);
            allJson.data.push(json);
          });
          console.log(allJson);
        });

}



function extractModel(store) {
  let schema = store.get('_identityMap._schema');
  let models = store.get('_identityMap._schema._models');
  let ideanodeModel = models.ideanode;
  model = ideanodeModel;
  console.log(store);
  console.log(schema);
  // console.log(ideanodeModel.attributes);
  let attributeKeys = Object.keys(ideanodeModel.attributes);
  model.attributeKeys = attributeKeys;
  // console.log(model.attributes);
  // console.log(ideanodeModel.relationships);
  let relationshipKeys = Object.keys(ideanodeModel.relationships);
  model.relationshipKeys = relationshipKeys;
  console.log(model.relationships);
}

function addAttributes(json, record) {
  json.attributes = {};
  model.attributeKeys.forEach(function(key) {
    let value;
    let keyType = model.attributes[key].type;
    switch (keyType) {
      case 'boolean':
        value = record.get(key) || false;
        break;
      case 'string':
        value = record.get(key) || '';
        break;
      case 'integer':
        value = record.get(key) || 0;
        break;
      case 'number':
        value = record.get(key) || 0;
        break;
      case 'datetime':
        let date = new Date(0);
        value = record.get(key) || date.toISOString();
        break;
      default:
        value = record.get(key);
    };
    json.attributes[key] = value;
  });
}

function addRelationships(json, record) {
  json.relationships = {};
  model.relationshipKeys.forEach(function(key) {
    let value;
    let keyType = model.relationships[key].type;
    switch (keyType) {
      case 'hasOne': {
        if (record.get(key)) {
          json.attributes[key] = record.get(key).get('id');
        } else {
          json.attributes[key] = '';
        }
        break;
      }
      case 'hasMany': {
        let childrenNodes = record.get(key)._content;
        if (childrenNodes.length > 0) {
          console.log('HasChildren');
          json.relationships[key] = {};
          json.relationships[key].data = [];
          childrenNodes.forEach(function(childNode) {
            json.relationships[key].data.push({
              id: childNode.get('id'),
              type: childNode.get('type')});
          });
        }
        break;
      }
      default:
        throw new Error('Unknown relationship key');
    };
  });
}
