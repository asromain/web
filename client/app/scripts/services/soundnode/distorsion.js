'use strict';

/**
 * @ngdoc service
 * @name webClientSideApp.Distorsion
 * @description
 * # Distorsion
 * Factory in the webClientSideApp.
 */
angular.module('webClientSideApp')
  .factory('Distorsion', function ($log, AbstractSoundnode, NodeParameter) {
    // Service logic
    function Distorsion() {}
    Distorsion.prototype = Object.create(AbstractSoundnode.prototype);

    Distorsion.prototype.type = 'distorsion';

    Distorsion.prototype.initNode = function(audioContext) {

      this.distorsion = audioContext.createWaveShaper();

      this.parameters[0] = new NodeParameter();
      this.parameters[0].name = 'curveValue';
      this.parameters[0].min = 0;
      this.parameters[0].max = 600;
      this.parameters[0].step = 1;

      if(typeof this.value.curveValue === 'undefined' || this.value.curveValue === null) {
        this.curveValue = 400;
        this.value.curveValue = 400;
      } else {
        this.curveValue = this.value.curveValue;
      }
      this.distorsion.curve = this.makeDistortionCurve(this.curveValue);
      this.distorsion.oversample = '4x';
    };
    Distorsion.prototype.setValue = function() {
      this.value.curveValue = this.curveValue;
    };

    Distorsion.prototype.setDistortionCurve = function() {
      this.distorsion.curve = this.makeDistortionCurve(this.curveValue);
    };

    Distorsion.prototype.makeDistortionCurve = function (amount) {
      var k = typeof amount === 'number' ? amount : 50,
        n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
      for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
      }
      return curve;
    };
    Distorsion.prototype.setParameters = function(paramName) {
      this.distorsion.curve = this.makeDistortionCurve(this.value.curveValue);
    };
    Distorsion.prototype.getInput = function() {
      return this.distorsion;
    };
    Distorsion.prototype.getOutput = function() {
      return this.distorsion;
    };

    // Public API here
    return Distorsion;
  });
