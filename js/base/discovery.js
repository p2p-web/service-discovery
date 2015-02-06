/*global EventDispatcher
*/

(function(exports) {
  'use strict';

  var BaseDiscovery = function() {
    EventDispatcher.mixin(
      this, ['service-found', 'service-lost', 'available', 'unavailable']
    );
  };

  BaseDiscovery.prototype.startDiscovery = function(type) {
    throw new Error('Not Implemented!');
  };

  BaseDiscovery.prototype.stopDiscovery = function() {
    throw new Error('Not Implemented!');
  };

  BaseDiscovery.prototype.getServiceById = function(id) {
    throw new Error('Not Implemented!');
  };

  BaseDiscovery.prototype.isAvailable = function() {
    return false;
  };

  exports.BaseDiscovery = BaseDiscovery;
})(this);
