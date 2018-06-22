import Ember from 'ember';

export function concatString(strungs : string[]) {
  let concatenated = '';
  // Since `strungs` is an array of arguments.
  strungs.forEach((strung) => concatenated += ' ' + strung);
  return concatenated;
}

export default Ember.Helper.helper(concatString);
