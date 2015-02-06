/*global BaseDiscovery,
         BluetoothService,
         Symbol
*/

(function(exports) {
  'use strict';

  const priv = {
    onDeviceFound: Symbol('BluetoothDiscovery.onDeviceFound'),
    name: Symbol('Service.name'),
    type: Symbol('Service.type'),
    address: Symbol('Service.address')
  };

  var BluetoothDiscovery = function() {
    BaseDiscovery.call(this);

    this[priv.onDeviceFound] = this[priv.onDeviceFound].bind(this);
  };
  BluetoothDiscovery.prototype = Object.create(BaseDiscovery.prototype);

  BluetoothDiscovery.prototype.startDiscovery = function(type) {
    if (!this.isAvailable()) {
      throw new Error('Service discovery is not available!');
    }

    var adapterRequest = navigator.mozBluetooth.getDefaultAdapter();

    adapterRequest.onsuccess = () => {
      var adapter = adapterRequest.result;
      adapter.addEventListener('devicefound', this[priv.onDeviceFound]);
      adapter.startDiscovery();
    };

    adapterRequest.onerror = () => {
      console.error('BluetoothDiscovery start failed: ', adapterRequest.error);
    };

    /*navigator.mozBluetooth.getDefaultAdapter().then((adapter) => {
      adapter.addEventListener('devicefound', this[priv.onDeviceFound]);
      adapter.startDiscovery();
    }).catch((e) => {
      console.error('BluetoothDiscovery start failed: ', e);
    });*/
  };

  BluetoothDiscovery.prototype.stopDiscovery = function() {
    if (!this.isAvailable()) {
      throw new Error('Service discovery is not available!');
    }

    navigator.mozBluetooth.getDefaultAdapter().then((adapter) => {
      adapter.stopDiscovery();
    }).catch((e) => {
      console.error('BluetoothDiscovery.stop failed: ', e);
    });
  };

  BluetoothDiscovery.prototype.isAvailable = function() {
    if (!navigator.mozBluetooth) {
      return false;
    }

    if (!navigator.mozBluetooth.enabled) {
      return false;
    }

    return true;
  };

  BluetoothDiscovery.prototype[priv.onDeviceFound] = function(e) {
    var serviceId = e.device.address + ':' + e.device.class;
    this.emit(
      'service-found',
      new BluetoothService(
        serviceId, 'Bluetooth', e.device.name, e.device.address, e.device.class
      )
    );
  };

  exports.BluetoothDiscovery = BluetoothDiscovery;
})(this);
