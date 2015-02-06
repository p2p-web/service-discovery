/*global BaseDiscovery,
         BluetoothService,
         Symbol
*/

(function(exports) {
  'use strict';

  const priv = {
    discoveryManager: Symbol('BluetoothDiscovery.discoveryManager'),
    onDeviceFound: Symbol('BluetoothDiscovery.onDeviceFound'),
    onEnabled: Symbol('BluetoothDiscovery.onEnabled'),
    onDisabled: Symbol('BluetoothDiscovery.onDisabled')
  };

  var BluetoothDiscovery = function() {
    BaseDiscovery.call(this);

    var discoveryManager = navigator.mozBluetooth;

    discoveryManager.addEventListener('enabled', this[priv.onEnabled]);
    discoveryManager.addEventListener('disabled', this[priv.onDisabled]);

    this[priv.discoveryManager] = discoveryManager;
    this[priv.onDeviceFound] = this[priv.onDeviceFound].bind(this);
  };
  BluetoothDiscovery.prototype = Object.create(BaseDiscovery.prototype);

  BluetoothDiscovery.prototype.startDiscovery = function(type) {
    var discoveryManager = this[priv.discoveryManager];

    if (!this.isAvailable()) {
      throw new Error('Service discovery is not available!');
    }

    console.log('BT-ServiceDiscovery started');

    discoveryManager.getDefaultAdapter().then((adapter) => {
      adapter.addEventListener('devicefound', this[priv.onDeviceFound]);
      adapter.startDiscovery();
    }).catch((e) => {
      console.error('BluetoothDiscovery start failed: ', e);
    });
  };

  BluetoothDiscovery.prototype.stopDiscovery = function() {
    var discoveryManager = this[priv.discoveryManager];

    if (!this.isAvailable()) {
      throw new Error('Service discovery is not available!');
    }

    console.log('BT-ServiceDiscovery stopped');

    discoveryManager.getDefaultAdapter().then((adapter) => {
      adapter.stopDiscovery();
    }).catch((e) => {
      console.error('BluetoothDiscovery.stop failed: ', e);
    });
  };

  BluetoothDiscovery.prototype.isAvailable = function() {
    var discoveryManager = this[priv.discoveryManager];

    if (!discoveryManager) {
      return false;
    }

    if (!discoveryManager.enabled) {
      return false;
    }

    return true;
  };

  BluetoothDiscovery.prototype[priv.onDeviceFound] = function(e) {
    var serviceId = e.device.address + ':' + e.device.class;
    console.log('BT-ServiceDiscovery service found: ' + serviceId);
    this.emit(
      'service-found',
      new BluetoothService(
        serviceId, 'Bluetooth', e.device.name, e.device.address, e.device.class
       )
    );
  };

  BluetoothDiscovery.prototype[priv.onEnabled] = function() {
    this.emit('available');
  };

  BluetoothDiscovery.prototype[priv.onDisabled] = function() {
    this.emit('unavailable');
  };

  exports.BluetoothDiscovery = BluetoothDiscovery;
})(this);
