/*global BaseService,
         Symbol
*/

(function(exports) {
  'use strict';

  const priv = {
    deviceClass: Symbol('BluetoothService.deviceClass')
  };

  var BluetoothService = function(id, type, name, address, deviceClass) {
    BaseService.call(this, id, type, name, address);

    this[priv.deviceClass] = deviceClass;
  };
  BluetoothService.prototype = Object.create(BaseService.prototype);

  Object.defineProperty(BluetoothService.prototype, 'deviceClass', {
    enumerable: true,
    get: function() {
      return this[priv.deviceClass];
    }
  });

  exports.BluetoothService = BluetoothService;
})(this);
