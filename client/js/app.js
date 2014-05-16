var angular = angular;

angular.module('app', ['ngRoute'])
.controller('HomeController', function($scope) {
  $scope.user = 'davis';
})
.controller('ShortenController', function($scope) {
  $scope.user = 'jules';
})

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'HomeController',
      templateUrl: '/client/templates/home.html'
    })
    .when('/shorten', {
      controller: 'ShortenController',
      templateUrl: '/client/templates/shorten.html'
    })
    .otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
}]);
