/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import flatten from '../utils/flatten';
import cycleBreaker from '../utils/cycle-breaker';

const {
  get,
  set,
  RSVP,
  computed,
  isEmpty,
  A: emberArray
} = Ember;

const A = emberArray();

function callable(method) {
  return function(collection) {
    return A[method].apply(collection, arguments);
  };
}

const uniq = callable('uniq');
const compact = callable('compact');

export default Ember.Object.extend({
  content: null,
  attribute: '',

  init() {
    this._super(...arguments);
    set(this, 'content', emberArray(get(this, 'content')));
  },

  isInvalid: computed.not('isValid'),

  isValid: computed('content.@each.isValid', cycleBreaker(function() {
    return get(this, 'content').isEvery('isValid', true);
  }, true)),

  isValidating: computed('content.@each.isValidating', cycleBreaker(function() {
    return !get(this, 'content').isEvery('isValidating', false);
  }, false)),

  isTruelyValid: computed('content.@each.isTruelyValid', cycleBreaker(function() {
    return get(this, 'content').isEvery('isTruelyValid', true);
  }, true)),

  isDirty: computed('content.@each.isDirty', cycleBreaker(function() {
    return !get(this, 'content').isEvery('isDirty', false);
  }, false)),

  isAsync: computed('content.@each.isAsync', cycleBreaker(function() {
    return !get(this, 'content').isEvery('isAsync', false);
  }, false)),

  messages: computed('content.@each.{message,messages}', cycleBreaker(function() {
    /**
     * A validation result collection can be a collection of ValidationResult objects which will only have a single message,
     * a ValidationResultCollection which will have multiple messages,
     * and a model validations object which again will have multiple messages.
     */
    var messages = [
      get(this, 'content').getEach('message'),
      get(this, 'content').getEach('messages')
    ];
    var messageArray = flatten(messages);
    return uniq(compact(messageArray));
  })),

  _promise: computed('content.@each._promise', cycleBreaker(function() {
    var promises = get(this, 'content').getEach('_promise');
    if (!isEmpty(promises)) {
      return RSVP.all(compact(flatten(promises)));
    }
  })),

  message: computed('messages.[]', cycleBreaker(function() {
    return get(this, 'messages.0');
  })),

  value: computed('isAsync', cycleBreaker(function() {
    var isAsync = get(this, 'isAsync');
    var promise = get(this, '_promise');
    return isAsync ? promise : this;
  }))
});
