var app = angular.module('meanReddit', ['ui.router']);

app.factory('posts', [function () {
  var o = {
    posts: []
  };
  return o;
}]);


app.controller('MainCtrl', ['$scope','posts', function ($scope, posts) {
  $scope.posts = posts.posts;

}]);
