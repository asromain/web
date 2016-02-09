'use strict';

/**
 * @ngdoc service
 * @name webClientSideApp.pedal
 * @description
 * # pedal
 * Service in the webClientSideApp.
 */
angular.module('webClientSideApp')
  .service('pedal', function ($http, $log, $q, user , $notification) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    return {
      createPedal: (function (pedal , u) {
        var deferred = $q.defer();
        $http.post("http://localhost:3000/api/pedals/", pedal)
          .success(function (data) {
            $notification.success("Pedal", "pedal created");
            $log.info('post success on pedal : ');
            pedal._id = data._id;
            deferred.resolve(data);

          })
          .error(function () {
            $log.error('post error on pedal ');
            $notification.error("Pedal", "");

            deferred.reject(false);
          });
        return deferred.promise;
      })
    };
  });
