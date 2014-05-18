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
  $scope.submit = function() {
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
.controller('LoginController', function($scope, $http, $window) {
  $scope.user = {username: $scope.username, password: $scope.password};
  $scope.message = '';
  $scope.submit = function() {
    $http
      .post('/login', $scope.user)
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        $scope.message = 'Welcome';
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.sessionStorage.token;

        // Handle login errors here
        $scope.message = 'Error: Invalid user or password';
      });
  };

})
.controller('SignupController', function($scope, $http, $window){
  $scope.message = '';
  $scope.submit = function() {
    $http.post('/signup', {username: $scope.username, password: $scope.password})
      .success(function (data, status, headers, config) {
        $window.sessionStorage.token = data.token;
        $scope.message = 'Welcome';
      })
      .error(function (data, status, headers, config) {
        // Erase the token if the user fails to log in
        delete $window.sessionStorage.token;

        // Handle login errors here
        $scope.message = 'Error: Invalid user or password';
      });
  };
})

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'HomeController',
      templateUrl: '/client/templates/home.html',
      access: 'access.loggedin'
    })
    .when('/shorten', {
      controller: 'ShortenController',
      templateUrl: '/client/templates/shorten.html',
      access: 'access.loggedin'
    })
    .when('/login', {
      controller: 'LoginController',
      templateUrl: '/client/templates/login.html',
      access: 'access.public'
    })
    .when('/signup', {
      controller: 'SignupController',
      templateUrl: '/client/templates/signup.html',
      access: 'access.public'
    })
    .otherwise({redirectTo: '/login'});
  $locationProvider.html5Mode(true);
}]);
