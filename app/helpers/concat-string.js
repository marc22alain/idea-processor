import Ember from 'ember';

export function concatString(strings) {
  let concatenated = '';
  // Since `strings` is an array of arguments.
  strings.forEach((string) => concatenated += ' ' + string);
  return concatenated;
}

export default Ember.Helper.helper(concatString);
