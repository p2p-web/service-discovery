/*global BaseDiscovery,
         LanService,
         DNSSD,
         Symbol
*/

(function(exports) {
  'use strict';

  const priv = {
    discoveryManager: Symbol('LanDiscovery.discoveryManager'),
    onEnabled: Symbol('LanDiscovery.onEnabled'),
    onDisabled: Symbol('LanDiscovery.onDisabled'),
    onConnectionStatusChanged: Symbol('LanDiscovery.onConnectionStatusChanged')
  };

  var LanDiscovery = function() {
    BaseDiscovery.call(this);

    var discoveryManager = navigator.mozWifiManager;

    discoveryManager.addEventListener('enabled', this[priv.onEnabled]);
    discoveryManager.addEventListener('disabled', this[priv.onDisabled]);

    this[priv.discoveryManager] = discoveryManager;
  };
  LanDiscovery.prototype = Object.create(BaseDiscovery.prototype);

  LanDiscovery.prototype.startDiscovery = function(type) {
    if (!this.isAvailable()) {
      throw new Error('Service discovery is not available!');
    }

    console.log('Lan-ServiceDiscovery started');

    DNSSD.addEventListener('discovered', (e) => {
      e.services.forEach((serviceType) => {
        if (!type || serviceType === type) {
          // Service id is a unique identifier for the given user-selected
          // service instance. So we should use mac address instead of IP here.
          var serviceId = e.address + ':' + serviceType;
          console.log('Lan-ServiceDiscovery service found: ' + serviceId);
          // Service name should be human readable name of the service, we don't
          // have this right now.
          var serviceName = e.address;
          this.emit(
            'service-found',
            new LanService(serviceId, serviceType, serviceName, e.address, 0)
          );
        }
      });
    });

    DNSSD.startDiscovery();
  };

  LanDiscovery.prototype.stopDiscovery = function() {
    if (!this.isAvailable()) {
      throw new Error('Service discovery is not available!');
    }

    console.log('BT-ServiceDiscovery stopped');

    DNSSD.stopDiscovery();
  };

  LanDiscovery.prototype.isAvailable = function() {
    var discoveryManager = this[priv.discoveryManager];

    if (!discoveryManager) {
      return false;
    }

    if (!discoveryManager.enabled) {
      return false;
    }

    if (discoveryManager.connection.status !== 'connected') {
      return false;
    }

    return true;
  };

  LanDiscovery.prototype[priv.onEnabled] = function() {
    var discoveryManager = this[priv.discoveryManager];

    if (discoveryManager.connection.status !== 'connected') {
      return;
    }

    this.emit('available');
  };

  LanDiscovery.prototype[priv.onDisabled] = function() {
    this.emit('unavailable');
  };

  LanDiscovery.prototype[priv.onConnectionStatusChanged] = function() {
    var discoveryManager = this[priv.discoveryManager];

    if (discoveryManager.connection.status === 'connected' &&
        discoveryManager.enabled){
      this.emit('available');
      return;
    }

    this.emit('unavailable');
  };

  exports.LanDiscovery = LanDiscovery;
})(this);
