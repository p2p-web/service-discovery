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
        serviceNode.textContent = service.name + ':' + service.type;

        if (service instanceof BluetoothService) {
          btServiceList.appendChild(serviceNode);
        } else {
          lanServiceList.appendChild(serviceNode);
        }
      };

      discoveries.forEach((discovery) => {
        if (discovery.isAvailable()) {
          discovery.on('service-found', onServiceDiscovered);
          discovery.startDiscovery();
        }
      });
    });
  });
})(window);
