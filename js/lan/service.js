/*global BaseService,
         Symbol
*/

(function(exports) {
  'use strict';

  const priv = {
    port: Symbol('LanService.port')
  };

  var LanService = function(id, type, name, address, port) {
    BaseService.call(this, id, type, name, address);

    this[priv.port] = port;
  };
  LanService.prototype = Object.create(BaseService.prototype);

  Object.defineProperty(LanService.prototype, 'port', {
    enumerable: true,
    get: function() {
      return this[priv.port];
    }
  });

  exports.LanService = LanService;
})(this);
