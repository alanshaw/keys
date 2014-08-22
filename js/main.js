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

keys.controller("Open", function ($scope, $location, $timeout) {
  $scope.newFile = function () {
    $location.path("/key-list")
  }
  $scope.onFileChange = function (file) {
    $location.path("/key-list").search("file", file); $scope.$apply()
  }
  $timeout(function () { $("#open").transition("pulse") }, 250)
})

keys.controller("KeyList", function ($scope, $location) {
  var encryptedContents = null

  $scope.password = null
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
    $scope.keys.push(key)
    $scope.key = key
  }

  $scope.removeKey = function (key) {
    var keys = $scope.keys, i = keys.indexOf(key)
    $scope.key = keys[i + 1] ? keys[i + 1] : keys[i - 1] ? keys[i - 1] : null
    keys.splice(i, 1)
  }

  $scope.onPasswordChange = function () {
    var modal = $("#password-modal")
    $(".field", modal).removeClass("error")

    try {
      $scope.keys = JSON.parse(encryptedContents)
      $scope.key = $scope.keys[0]
      modal.modal("hide")
    } catch(er) {
      console.error(er)
    }
  }

  $scope.onPasswordKeyup = function (e) {
    if (e.keyCode == 13) $("#password-modal .field").addClass("error")
  }

  if ($location.search().file) {
    $scope.$evalAsync(function () {
      fs.readFile($location.search().file, "utf8", function (er, contents) {
        if (er) return alert(er) // TODO: error handle
        encryptedContents = contents
        $("#password-modal").modal("setting", {closable: false}).modal("show")
      })
    })
  } else {
    $scope.addKey()
  }
})