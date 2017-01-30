var app = angular.module('meanReddit', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function (posts) {
          return posts.getAll();
        }]
      }
    })
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function ($stateParams, posts) {
          return posts.get($stateParams.id);
        }]
      }
    });

    $urlRouterProvider.otherwise('home');
}]);

app.factory('auth', ['$http', '$window', function ($http, $window) {
  var auth = {};

  auth.saveToken = function (token) {
    $window.localStorage['mean-reddit-token'] = token;
  };

  auth.getToken = function () {
    return $window.localStorage['mean-reddit-token'];
  };

  auth.isLoggedIn = function () {
    var token = auth.getToken();

    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function () {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function (user) {
    return $http.post('/register', user).success(function (data) {
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function (user) {
    return $http.post('/login', user).success(function (data) {
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function () {
    $window.localStorage.removeItem('mean-reddit-token');
  };

  return auth;
}]);

app.factory('posts', ['$http', 'auth', function ($http, auth) {
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
  o.upvote = function (post) {
    return $http.put('/posts/' + post._id + '/upvote').success(function (data) {
      post.upvotes +=1;
    });
  };
  o.downvote = function (post) {
    return $http.put('/posts/' + post._id + '/downvote').success(function (data) {
      post.downvotes +=1;
    });
  };
  o.addComment = function (id, comment) {
    return $http.post('/posts/' + id + '/comments', comment);
  };
  o.upvoteComment = function (post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote').success(function (data) {
      comment.upvotes += 1;
    });
  };
  o.downvoteComment = function (post, comment) {
    return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote').success(function (data) {
      comment.downvotes += 1;
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

  $scope.incUpvotes = function (post) {
    posts.upvote(post);
  };

  $scope.incDownvotes = function (post) {
    posts.downvote(post);
  };
}]);

app.controller('PostsCtrl', ['$scope', 'posts', 'post', function ($scope, posts, post) {
  $scope.post = post;

  $scope.addComment = function () {
    if (!$scope.body || $scope.body === '') { return; }
    posts.addComment(post._id, {
      body: $scope.body,
      author: 'user'
    }).success(function (comment) {
      $scope.post.comments.push(comment);
    });
    $scope.body = '';
  };

  $scope.incUpvotes = function (post) {
    posts.upvote(post);
  };

  $scope.incDownvotes = function (post) {
    posts.downvote(post);
  };

  $scope.incComUpvotes = function (comment) {
    posts.upvoteComment(post, comment);
  };

  $scope.incComDownvotes = function (comment) {
    posts.downvoteComment(post, comment);
  };

}]);
