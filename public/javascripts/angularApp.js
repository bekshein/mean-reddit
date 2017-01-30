var app = angular.module('meanReddit', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl'
    });

    $urlRouterProvider.otherwise('home');
}]);

app.factory('posts', ['$http', function ($http) {
  var o = {
    posts: []
  };
  o.getAll = function () {
    return $http.get('/posts').success(function (data) {
      angular.copy(data, o.posts);
    });
  };
  o.get = function (id) {
    return $http.get('/posts/' + id).then(function (res) {
      return res.data;
    });
  };
  o.create = function (post) {
    return $http.post('/posts', post).success(function (data) {
      o.posts.push(data);
    });
  };
  return o;
}]);


app.controller('MainCtrl', ['$scope','posts', function ($scope, posts) {
  $scope.posts = posts.posts;

  $scope.addPost = function () {
    if (!$scope.title || $scope.title === '') { return; }
    posts.create({
      title: $scope.title,
      link: $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
  };
}]);

app.controller('PostsCtrl', ['$scope', 'posts', function ($scope, posts) {

}]);
