'use strict';

/**
 * @ngdoc function
 * @name webClientSideApp.controller:LiveCtrl
 * @description
 * # LiveCtrl
 * Controller of the webClientSideApp
 */
angular.module('webClientSideApp')
  .controller('LiveCtrl', function ($scope, $window, $log, $timeout, NodeStorage, wsEffects) {
    var vm = this;
    $scope.nodeStorage = new NodeStorage();

    $scope.ready = false;
    var input = {
        id: 0,
        type: 'input',
        posx: null,
        posy: null,
        value: null,
        suivant: []
      };
    var output = {
        id: 1,
        type: 'output',
        posx: null,
        posy: null,
        value: null,
        precedent: []
      };

    //this should be filled with data from server
    //To get what to save use : $scope.nodeStorage.backup()
    var backup = [];
    backup.push(input);
    backup.push(output);

    var defaultNode ={
      id: null,
      type: null,
      posx: null,
      posy: null,
      value: null,
      precedent: [],
      suivant: []
    };

    $scope.effects = [
      'gain',
      'allpass',
      'bandpass',
      'highpass',
      'highshelf',
      'lowpass',
      'lowshelf',
      'notch',
      'peaking'
    ];

    $scope.addEffect = function(type) {
      var effect = angular.copy(defaultNode);
      effect.type = type;
      var id = $scope.nodeStorage.addNode(effect);
      jsPlumb.repaintEverything();
    };

    $scope.deleteEffect = function(id) {
      $scope.nodeStorage.removeNode(id);
      jsPlumb.repaintEverything();
    };

    angular.element($window).bind('resize', function() {
      jsPlumb.repaintEverything();
    });

    navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
      console.log('getUserMedia supported.');
      $scope.ready = true;
    } else {
      $scope.ready = false;
    }

    $scope.$on('$viewContentLoaded', function(){
      jsPlumb.setContainer("live-page-pedals");

      jsPlumb.bind('connection', function(info) {
        var inputId = info.sourceId;
        var outputId = info.targetId;
        $scope.nodeStorage.connect(inputId, outputId);
      });
      jsPlumb.bind('connectionDetached', function(info) {
        var inputId = info.sourceId;
        var outputId = info.targetId;
        $scope.nodeStorage.disconnect(inputId, outputId);
      });

      /*var backup = wsEffects.get().then(function(response) {
          $log.info('get effect succes : ' + response);
          $timeout(function() {
            $scope.nodeStorage.setup(response.data);
          }, 100);
        },
        function(response) {
          $log.error('get request on effect failed : '+response);
        });*/
      $timeout(function() {
        $scope.nodeStorage.setup(backup);
      }, 100);
    });

    //Prevent ngRepeat from try to print undefined elements
    $scope.isUndefined = function(item) {
      return (typeof item !== 'undefined');
    };
  });
