var gui = require("nw.gui")

module.exports = function ($scope, $location, $timeout) {
  gui.Window.get().menu = require("./open-menu")()

  $scope.newFile = function () {
    $location.path("/key-list")
  }

  $scope.onFileChange = function (file) {
    $location.path("/key-list").search("file", file); $scope.$apply()
  }

  $timeout(function () { $("#open").transition("pulse") }, 250)
}