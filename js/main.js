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