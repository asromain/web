'use strict';

/**
 * @ngdoc service
 * @name webClientSideApp.Delay
 * @description
 * # Delay
 * Factory in the webClientSideApp.
 */
angular.module('webClientSideApp')
  .factory('Delay', function (AbstractSoundnode, NodeParameter) {
    // Service logic
    function Delay() {}
    Delay.prototype = Object.create(AbstractSoundnode.prototype);

    Delay.prototype.type = 'delay';

    Delay.prototype.initNode = function(audioContext) {

      this.input = audioContext.createGain();
      this.feedback = audioContext.createGain();
      this.delay = audioContext.createDelay();
      this.output = audioContext.createGain();

      this.feedback.gain.value = 0.2;

      this.parameters[0] = new NodeParameter();
      this.parameters[0].name = 'delayTime';
      this.parameters[0].min = 0;
      this.parameters[0].max = 10;
      this.parameters[0].step = 0.1;

      if(typeof this.value.delayTime === 'undefined' || this.value.delayTime === null) {
        this.delay.delayTime.value = 0;
        this.value.delayTime = 0;
      } else {
        this.delay.delayTime.value = this.value.delayTime;
      }

      // dry path
      this.input.connect(output);

      // wet path
      this.input.connect(this.delay);

      // feedback loop
      this.delay.connect(this.feedback);
      this.feedback.connect(this.delay);

      this.feedback.connect(output);
    };
    Delay.prototype.setValue = function() {
      this.value.delayTime = this.delay.delayTime.value;
    };
    Delay.prototype.setParameters = function(paramName) {
      this.delay[paramName].value = this.value[paramName];
    };
    Delay.prototype.getInput = function() {
      return this.delay;
    };
    Delay.prototype.getOutput = function() {
      return this.delay;
    };

    // Public API here
    return Delay;
  });
