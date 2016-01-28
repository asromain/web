'use strict';

/**
 * @ngdoc service
 * @name webClientSideApp.audionodeSelector
 * @description
 * # audionodeSelector
 * Factory in the webClientSideApp.
 */
angular.module('webClientSideApp')
  .factory('audionodeSelector',
    function ($log, Inputnode, Outputnode, Gain, LowPass, HighPass, BandPass, LowShelf, HighShelf) {

    // Service logic
    var selectNode = function(type) {
      if(type === 'input')
        return new Inputnode();
      if(type === 'output')
        return new Outputnode();
      if(type === 'gain')
        return new Gain();
      if(type === 'lowpass')
        return new LowPass();
      if(type === 'highpass')
        return new HighPass();
      if(type === 'bandpass')
        return new BandPass();
      if(type === 'lowshelf')
        return new LowShelf();
      if(type === 'highshelf')
        return new HighShelf();
      return null;
    };

    return {
      getAudionode: function(type) {
        return selectNode(type);
      }
    };
  });
