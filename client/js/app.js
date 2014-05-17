var angular = angular;

angular.module('app', ['ngRoute'])
.controller('HomeController', function($scope, $http) {
  $http.get('/links').success(function(data){
    $scope.links = data;
  });
})
.controller('ShortenController', function($scope, $http, $location) {
  $scope.link = 'http://google.com';
  // $scope.spinnerStatus = false;
  $scope.saveLink = function() {
    $scope.spinnerToggle();
    $http.post('/links', {url: $scope.link})
      .success(function() {
        console.log('post!', $scope.link);
        $scope.spinnerToggle();
        $location.path('/');
        $scope.messagePreview();
      });
  };
  $scope.spinnerToggle = function() {
    $scope.spinnerStatus = !$scope.spinnerStatus;
  };
  $scope.messagePreview = function() {
    // show preview
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
