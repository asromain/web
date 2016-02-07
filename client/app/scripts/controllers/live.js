'use strict';

/**
 * @ngdoc function
 * @name webClientSideApp.controller:LiveCtrl
 * @description
 * # LiveCtrl
 * Controller of the webClientSideApp
 */
angular.module('webClientSideApp')
  .controller('LiveCtrl', function ($scope, $window, $log, $timeout,  $routeParams, $location, NodeStorage, wsEffects, saveState, InitInput) {
    var vm = this;
    $scope.nodeStorage = NodeStorage.get();
    $scope.ready = false;

    //this should be filled with data from server
    //To get what to save use : $scope.nodeStorage.backup()
    /*var backup = [];
     backup.push(input);
     backup.push(output);*/

    var defaultNode ={
      id: null,
      name: null,
      type: null,
      posx: null,
      posy: null,
      value: {},
      precedents: [],
      suivants: []
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
      'peaking',
      'convolver',
      'delay',
      'distorsion',
      'compressor'
    ];

    $scope.addEffect = function(type) {
      var effect = angular.copy(defaultNode);
      effect.type = type;
      $scope.nodeStorage.addNode(effect);
      jsPlumb.repaintEverything();
      saveState.save($routeParams.id);
    };

    $scope.deleteEffect = function(id) {
      $scope.nodeStorage.removeNode(id);
      jsPlumb.repaintEverything();
      saveState.save($routeParams.id);
    };

    angular.element($window).bind('resize', function() {
      jsPlumb.repaintEverything();
      saveState.save($routeParams.id);
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
      $timeout(function() {
        jsPlumb.setContainer("live-page-pedals");

        jsPlumb.bind('connection', function (info) {
          var inputId = info.sourceId;
          var outputId = info.targetId;
          $scope.nodeStorage.connect(inputId, outputId);
          saveState.save($routeParams.id);
        });
        jsPlumb.bind('connectionDetached', function (info) {
          var inputId = info.sourceId;
          var outputId = info.targetId;
          $scope.nodeStorage.disconnect(inputId, outputId);
          saveState.save($routeParams.id);
        });

        wsEffects.get($routeParams.id).then(function (response) {
          $scope.nodeStorage.setupPedal(response.effects);
          $timeout(function () {
            $scope.nodeStorage.redoConnections();
          }, 1000);
        }, function () {
          $location.path('/');
        });

        InitInput.getMediaInput().then(function (node) {
          NodeStorage.get().storage[0].output = node;
          $scope.nodeStorage.restaureConnections(0);
        }, function (err) {
        });
        InitInput.getMediaPlaySound().then(function (node, data) {
          NodeStorage.get().storage[0].playSound = node;
          NodeStorage.get().storage[0].music = data;
          NodeStorage.get().storage[0].ready = true;
          $scope.nodeStorage.restoreInputPlaySound();
        }, function () {
        });
      }, 1000);
    });

    //Prevent ngRepeat from try to print undefined elements
    $scope.isUndefined = function(item) {
      return (typeof item !== 'undefined');
    };

    $scope.$on("$destroy", function(){
      NodeStorage.get().wipe();
      angular.element($window).unbind('resize');
      $log.warn('living live controller !');
    });
  });

//56b31666805a445a3138ccf0
