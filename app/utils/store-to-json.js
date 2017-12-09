import Ember from 'ember';

/*
  NOTES:
  - a hasOne relationship results in the related node being stored as a simple attribute, with its id as the value.

  Ref: Took file-saving hints from RecorderJS Recorder.forceDownload()
*/

var model;

export default function storeToJson(store) {
  extractModel(store);
  return new Ember.RSVP.Promise(function(resolve, reject) {
    store.query(q => q.findRecords('ideanode'))
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
            saveFile(allJson);
            resolve('√');
          })
          .catch((e) => {
            reject(e);
          });
  });
}



function extractModel(store) {
  let schema = store.get('_identityMap._schema');
  let models = store.get('_identityMap._schema._models');
  let ideanodeModel = models.ideanode;
  model = ideanodeModel;
  let attributeKeys = Object.keys(ideanodeModel.attributes);
  model.attributeKeys = attributeKeys;
  let relationshipKeys = Object.keys(ideanodeModel.relationships);
  model.relationshipKeys = relationshipKeys;
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

function saveFile(data) {
  var file = new Blob([JSON.stringify(data)], {type: 'text/plain'});
  var url = (window.URL || window.webkitURL).createObjectURL(file);
  let date = new Date();
  let filename = 'store-data_' + date.toLocaleDateString().replace(/\//g, '-') + '.json';

  var link = window.document.createElement('a');
  link.href = url;
  link.download = filename;
  var click = document.createEvent("Event");
  click.initEvent("click", true, true);
  link.dispatchEvent(click);

  setTimeout(function() {
      window.URL.revokeObjectURL(url);
  }, 0);

}
