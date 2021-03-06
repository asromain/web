'use strict';

nx.onload = function () {
  nx.colorize("black", "#FFFFFF");
};

/**
 * @ngdoc overview
 * @name webClientSideApp
 * @description
 * # webClientSideApp
 *
 * Main module of the application.
 */
angular
  .module('webClientSideApp', [
    'ngRoute',
    'ngCookies',
    'notifications',
    'ngAnimate',
    'ui.bootstrap',
    'angular-md5'
  ])
  .constant('config',
    {
      apiURL: "http://localhost:3000/",
      samples: "samples/",
      users: "api/users/",
      users_auth: "auth",
      pedals: "api/pedals/",
      pedal_comments: "/comments",
      pedal_users: "/users",
      pedal_rates: "/rate",
      pedal_design: "/design"
    }
  )
  .config(function ($routeProvider, $compileProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      //.when('/main_old', {
      //  templateUrl: 'views/main_old.html',
      //  controller: 'MainOld',
      //  controllerAs: 'mainold'
      //})
      .when('/pedal', {
        templateUrl: 'views/pedal.html',
        controller: 'AboutCtrl',
        controllerAs: 'pedal'
      })
      //.when('/about', {
      //  templateUrl: 'views/about.html',
      //  controller: 'AboutCtrl',
      //  controllerAs: 'about'
      //})
      .when('/pedal/:id', {
        templateUrl: 'views/live.html',
        controller: 'LiveCtrl',
        controllerAs: 'live'
      })
      .when('/create-pedal', {
        templateUrl: 'views/create-pedal.html',
        controller: 'MainCtrl',
        controllerAs: 'createPedal'
      })
      .when('/pedal/:id/design', {
        templateUrl: 'views/pedal-design.html',
        controller: 'PedalDesignCtrl',
        controllerAs: 'pedalDesign'
      })
      .when('/pedal/:id/comments', {
        templateUrl: 'views/pedal-comments.html',
        controller: 'PedalCommentCtrl',
        controllerAs: 'pedalComments'
      })
      .when('/play/:id', {
        templateUrl: 'views/play.html',
        controller: 'PlayCtrl',
        controllerAs: 'play'
      })
      .when('/sign-in', {
        templateUrl: 'views/sign-in.html',
        controller: 'AuthenticationCtrl',
        controllerAs: 'authentication'
      })
      .when('/sign-up', {
        templateUrl: 'views/sign-up.html',
        controller: 'AuthenticationCtrl',
        controllerAs: 'authentication'
      })
      .when('/sign-out', {
        templateUrl: 'views/sign-out.html',
        controller: 'AuthenticationCtrl',
        controllerAs: 'authentication'
      })
      .otherwise({
        templateUrl: '404.html'
      });

    $compileProvider.debugInfoEnabled(true);
  })
  .run(function ($rootScope, $cookies, $location, $log, $route){
    $log.debug('In run function');

    $rootScope.isLogged = $cookies.getObject('user') !== undefined;

    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if($location.path().indexOf('/pedal') > -1 && $location.path().indexOf('/comments') < 0) {
        var pedalId = $location.path().split("/pedal/")[1];
        pedalId = pedalId.split("/")[0];
        $rootScope.isLive = true;
        $rootScope.pedalId = pedalId;
      } else {
        $rootScope.isLive = false;
      }

      if ($cookies.getObject('user') === undefined && $location.path() !== '/sign-in' && $location.path() !== '/sign-up') {
        $log.debug('not signed in. redirection...');
        $location.path("/sign-in");
        $route.reload();
     }
     });

  });

