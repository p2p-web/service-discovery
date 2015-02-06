/*global BaseDiscovery,
         LanService,
         DNSSD
*/

(function(exports) {
  'use strict';

  var LanDiscovery = function() {
    BaseDiscovery.call(this);
  };
  LanDiscovery.prototype = Object.create(BaseDiscovery.prototype);

  LanDiscovery.prototype.startDiscovery = function(type) {
    if (!this.isAvailable()) {
      throw new Error('Service discovery is not available!');
    }

    DNSSD.addEventListener('discovered', (e) => {
      e.services.forEach((serviceType) => {
        if (!type || serviceType === type) {
          // Service id is a unique identifier for the given user-selected
          // service instance. So we should use mac address instead of IP here.
          var serviceId = e.address + ':' + serviceType;
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

    DNSSD.stopDiscovery();
  };

  LanDiscovery.prototype.isAvailable = function() {
    if (!navigator.mozWifiManager) {
      return false;
    }

    if (!navigator.mozWifiManager.enabled) {
      return false;
    }

    if (navigator.mozWifiManager.connection.status !== 'connected') {
      return false;
    }

    return true;
  };

  exports.LanDiscovery = LanDiscovery;
})(this);
