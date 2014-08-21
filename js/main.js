var shortid = require("shortid")

var keys = angular.module("keys", [])

keys.controller("KeyList", function ($scope) {
  var keys = [
    {id: shortid(), name: "foo", username: "foo", password: "m7878m7eb3", notes: "foo notes"},
    {id: shortid(), name: "bar", username: "bar", password: "h56h65h76", notes: ""},
    {id: shortid(), name: "baz", username: "baz", password: "2f2ff2f2f2", notes: ""},
    {id: shortid(), name: "boz", username: "boz", password: "3f4ffff", notes: ""},
    {id: shortid(), name: "bozo", username: "bozo", password: "ef3433", notes: ""}
  ]

  $scope.keys = keys
  $scope.key = keys[0]

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
    var i = keys.indexOf(key)
    $scope.key = keys[i + 1] ? keys[i + 1] : keys[i - 1] ? keys[i - 1] : null
    keys.splice(i, 1)
  }
})