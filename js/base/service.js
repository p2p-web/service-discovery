/*global Symbol
*/

(function(exports) {
  'use strict';

  const priv = {
    id: Symbol('BaseService.id'),
    type: Symbol('BaseService.type'),
    name: Symbol('BaseService.name'),
    address: Symbol('BaseService.address')
  };

  var BaseService = function(id, type, name, address) {
    this[priv.id] = id;
    this[priv.type] = type;
    this[priv.name] = name;
    this[priv.address] = address;
  };

  Object.defineProperty(BaseService.prototype, 'id', {
    enumerable: true,
    get: function() {
      return this[priv.id];
    }
  });

  Object.defineProperty(BaseService.prototype, 'type', {
    enumerable: true,
    get: function() {
      return this[priv.type];
    }
  });

  Object.defineProperty(BaseService.prototype, 'name', {
    enumerable: true,
    get: function() {
      return this[priv.name];
    }
  });

  Object.defineProperty(BaseService.prototype, 'address', {
    enumerable: true,
    get: function() {
      return this[priv.address];
    }
  });

  exports.BaseService = BaseService;
})(this);
