var angular = angular;

angular.module('app', ['ngRoute'])
.controller('HomeController', function($scope, $http) {
  $http.get('/links').success(function(data){
    $scope.links = data;
  });
})
.controller('ShortenController', function($scope, $http) {
  $scope.link = 'http://google.com';
  $scope.saveLink = function() {
    console.log($scope.link);
    $http.post('/links', {url: $scope.link})
      .success(function() {
        console.log('post!', $scope.link);
      });
  };
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
