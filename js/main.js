var fs = require("fs")
var shortid = require("shortid")

var keys = angular.module("keys", ["ngRoute"])

keys.config(["$routeProvider", function ($routeProvider) {
  $routeProvider.when("/", {
    templateUrl: "partials/open.html",
    controller: "Open"
  }).when("/key-list", {
    templateUrl: "partials/key-list.html",
    controller: "KeyList"
  })
}])

keys.controller("Open", function ($scope, $location) {
  $scope.onFileChange = function (file) {
    $location.path("/key-list").search("file", file)
    $scope.$apply()
  }
})

keys.controller("KeyList", function ($scope, $location) {
  fs.readFile($location.search().file, "utf8", function (er, contents) {
    if (er) return alert(er) // TODO: error handle
    try {
      $scope.keys = JSON.parse(contents)
      $scope.key = $scope.keys[0]
      $scope.$apply()
    } catch(er) {
      return alert(er) // TODO: error handle
    }
  })

  $scope.keys = []
  $scope.key = null

  $scope.isActive = function (key) {
    return $scope.key ? $scope.key.id == key.id : false
  }

  $scope.setKey = function (key) {
    $scope.key = key
  }

  $scope.addKey = function () {
    var key = {id: shortid()}
    keys.push(key)
    $scope.setKey(key)
  }

  $scope.removeKey = function (key) {
    var keys = $scope.keys, i = keys.indexOf(key)
    $scope.key = keys[i + 1] ? keys[i + 1] : keys[i - 1] ? keys[i - 1] : null
    keys.splice(i, 1)
  }
})