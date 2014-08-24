(function () {
  var gui = require("nw.gui")

  function menu () {
    var menu = new gui.Menu({type: "menubar"})
    menu.createMacBuiltin("Keys")
    return menu
  }

  keys.controller("Open", function ($scope, $location, $timeout) {
    $scope.newFile = function () {
      $location.path("/key-list")
    }

    $scope.onFileChange = function (file) {
      $location.path("/key-list").search("file", file); $scope.$apply()
    }

    $timeout(function () { $("#open").transition("pulse") }, 250)

    gui.Window.get().menu = menu()
  })
})()