'use strict';

/**
 * @ngdoc service
 * @name webClientSideApp.AllPass
 * @description
 * # AllPass
 * Factory in the webClientSideApp.
 */
angular.module('webClientSideApp')
  .factory('AllPass', function ($log, AbstractSoundnode, NodeParameter) {
    // Service logic
    function AllPass() {}
    AllPass.prototype = Object.create(AbstractSoundnode.prototype);

    AllPass.prototype.type = 'allpass';

    AllPass.prototype.initNode = function(audioContext) {

      this.allpass = audioContext.createBiquadFilter();
      this.allpass.type = 'allpass';

      this.parameters[0] = new NodeParameter();
      this.parameters[0].name = 'frequency';
      this.parameters[0].min = 20;
      this.parameters[0].max = 20000;
      this.parameters[0].step = 1;

      this.parameters[1] = new NodeParameter();
      this.parameters[1].name = 'Q';
      this.parameters[1].min = 1;
      this.parameters[1].max = 1000;
      this.parameters[1].step = 1;

      if(typeof this.value.frequency === 'undefined' || this.value.frequency === null) {
        this.allpass.frequency.value = 440;
        this.value.frequency = 440;
      } else {
        this.allpass.frequency.value = this.value.frequency;
      }
      if(typeof this.value.Q === 'undefined' || this.value.Q === null) {
        this.allpass.Q.value = 0;
        this.value.Q = 0;
      } else {
        this.allpass.Q.value = this.value.Q;
      }
    };
    AllPass.prototype.setValue = function() {
      this.value.frequency = this.allpass.frequency.value;
      this.value.Q = this.allpass.Q.value;
    };
    AllPass.prototype.setParameters = function(paramName) {
      this.allpass[paramName].value = this.value[paramName];
    };
    AllPass.prototype.getInput = function() {
      return this.allpass;
    };
    AllPass.prototype.getOutput = function() {
      return this.allpass;
    };

    // Public API here
    return AllPass;
  });
