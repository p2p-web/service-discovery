/*global LanDiscovery,
         BluetoothService,
         BluetoothDiscovery
*/

(function() {
  'use strict';

  window.addEventListener('DOMContentLoaded', () => {
    var btnStartDiscovery = document.getElementById('btn-start-discovery');
    btnStartDiscovery.addEventListener('click', () => {
      var discoveries = [new LanDiscovery(), new BluetoothDiscovery()];
      var btServiceList = document.getElementById('bt-discovered-services');
      var lanServiceList = document.getElementById('lan-discovered-services');

      var onServiceDiscovered = function(service) {
        var serviceNode = document.createElement('li');
        serviceNode.id = service.id;
        serviceNode.textContent = service.name + ':' + service.type;

        if (service instanceof BluetoothService) {
          btServiceList.appendChild(serviceNode);
        } else {
          lanServiceList.appendChild(serviceNode);
        }
      };

      var onServiceLost = function(service) {
        var serviceNode = document.getElementById(service.id);

        if (serviceNode) {
          serviceNode.remove();
        }
      };

      discoveries.forEach((discovery) => {
        if (discovery.isAvailable()) {
          discovery.on('service-found', onServiceDiscovered);
          discovery.on('service-lost', onServiceLost);
          discovery.startDiscovery();
        } else {
          discovery.on('available', () => {
            discovery.on('service-found', onServiceDiscovered);
            discovery.on('service-lost', onServiceLost);
            discovery.startDiscovery();
          });
        }
      });
    });
  });
})(window);
