var keys = angular.module("keys", [])

keys.controller("KeyList", function ($scope) {
  var keys = [
    {id: 0, name: "foo", username: "foo", password: "m7878m7eb3", notes: "foo notes"},
    {id: 1, name: "bar", username: "bar", password: "h56h65h76", notes: ""},
    {id: 2, name: "baz", username: "baz", password: "2f2ff2f2f2", notes: ""},
    {id: 3, name: "boz", username: "boz", password: "3f4ffff", notes: ""},
    {id: 4, name: "bozo", username: "bozo", password: "ef3433", notes: ""}
  ]

  $scope.keys = keys
  $scope.key = keys[0]

  $scope.isActive = function (key) {
    return $scope.key.id == key.id
  }

  $scope.setKey = function (key) {
    $scope.key = key
  }
  
  $scope.search = function (e) {
  }
})