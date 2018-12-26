var app = angular.module('test', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
        })
        .when('/register', {
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl'
        })
        .when('/', {
            templateUrl: 'partials/profil.html',
            controller: 'ProfilCtrl'
        })
        .when('/editfriends', {
            templateUrl: 'partials/editFriends.html',
            controller: 'EditFriendsCtrl'
        })
        .when('/edit/:name', {
            templateUrl: 'partials/editProfil.html',
            controller: 'EditProfilCtrl'
        })

        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('LoginCtrl', function ($scope, $http, $rootScope, $location) {
    $scope.login = function () {
        $http({
            method: 'POST',
            url: './users/_login',
            data: $scope.user
        }).then(function successCallback(response) {
            console.log(response);
            if (response.data["status"] == "success") {
                $userPass = $scope.user.name + ":" + $scope.user.password;
                $rootScope.authHeader = "Basic " + window.btoa($userPass);
                $rootScope.user = $scope.user.name;
                console.log($rootScope.authHeader);
                $location.path('/');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };
});


app.controller('RegisterCtrl', function ($scope, $resource, $location) {
    $scope.register = function () {
        var User = $resource('/users');
        User.save($scope.user, function () {
            $location.path('/');
        });
    };
});

app.controller('ProfilCtrl', function ($scope, $resource, $rootScope, $location) {
    if ($rootScope.authHeader == undefined) {
        $location.path('/login');
    }
    var User = $resource('/users/:name', { name: '@name' }, 
    { 
        get: { method: 'GET', headers: { authorization: $rootScope.authHeader } } 
    });
    User.get({ name: $rootScope.user }, function (user) {
        $scope.user = user;
    });
});


app.controller('EditProfilCtrl', function ($scope, $resource, $rootScope, $location) {
    var User = $resource('/users/:name', { name: '@name' },
        {
            get: { method: 'GET', headers: { authorization: $rootScope.authHeader } },
            update: { method: 'PUT', headers: { authorization: $rootScope.authHeader } }
        });
    User.get({ name: $rootScope.user }, function (user) {
        $scope.user = user;
    });
    $scope.save = function () {
        User.update($scope.user, function (data) {
            console.log(data);
            $location.path('/');
        })
    }
});

app.controller('EditFriendsCtrl', function ($scope, $resource, $rootScope, $location) {
    var User = $resource('/users', {},
        {
            query: { method: 'GET', isArray: true, headers: { authorization: $rootScope.authHeader } },
        });
    var typiqueUser = $resource('/users/:name', { name: '@name' },
        {
            get: { method: 'GET', headers: { authorization: $rootScope.authHeader } },
            update: { method: 'PUT', headers: { authorization: $rootScope.authHeader } },
        });
    typiqueUser.get({ name: $rootScope.user }, function (user) {
        $scope.user = user;
        $scope.nFriends = [];
        User.query(function (users) {
            users.forEach(element => {
                if (!$scope.user.friends.includes(element['name']) && element['name'] != $rootScope.user) {
                    $scope.nFriends.push(element['name']);
                }
            });
        })
    });
    $scope.add = function () {
        //$scope.nFriends.pull($scope.selectedUser);
        $scope.user.friends.push($scope.selectedUser[0]);
        $location.path('/editfriends');
    }
    $scope.delete = function () {
        var index = $scope.user.friends.indexOf($scope.selectedFriend[0]);
        $scope.user.friends.splice(index, 1);
        $location.path('/editfriends');
    }
    $scope.save = function () {
        typiqueUser.update({ name: $rootScope.user, friends: $scope.user.friends }, function (data) {
            console.log(data);
            $location.path('/');
        })
    }
});

    