'use strict';

/**
 * @ngdoc service
 * @name webClientSideApp.user
 * @description
 * # user
 * Service in the webClientSideApp.
 */
angular.module('webClientSideApp')
  .factory('user', function ($http,$q , $rootScope , $notification) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var decision = false;

    return {
    	createUser : (function(user){
		    var deferred = $q.defer();

        $http.post("http://localhost:3000/api/users", user)
        return deferred.promise;
  		}),
      updateUser : (function(user){
		    var deferred = $q.defer();

        $http.put("http://localhost:3000/api/users/"+user._id, user)
        return deferred.promise;
  		}),
      checkUser : (function(user,myPedals){

        var deferred = $q.defer();

          $http.post("http://localhost:3000/api/users/auth", user)
              .success(function(data) {
                $notification.success("login", "connected successfuly");
                $rootScope.logged = true;

                user._id = data._id;
                user.pedals = data.pedals;
                for (var i=0 ; i < data.pedals.length; i++){
                    $http.get("http://localhost:3000/api/pedals/"+data.pedals[i])
                      .then(function(response){
                        myPedals.push(response.data);

                      });
                }
              //  myPedals.push(data.login.pedals);
                deferred.resolve(data);



              })
              .error(function() {
                decision = false;
                $notification.error("login", "refused");
                deferred.reject(false);

              });



        return deferred.promise;
      }),
      turnLogged : (function(){
        var deferred = $q.defer();
        return decision;
      })

  	};
  });
