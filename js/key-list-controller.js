var fs = require("fs")
  , path = require("path")
  , crypto = require("crypto")
  , shortid = require("shortid")
  , concat = require("concat-stream")
  , gui = require("nw.gui")

module.exports = function ($scope, $location) {
  gui.Window.get().menu = require("./key-list-menu")()

  $scope.password = null
  $scope.file = $location.search().file || "passwords.ke"
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

  $scope.onPasswordKeyup = function (e) {
    if (e.keyCode != 13) {
      return $scope.passwordError = false
    }

    fs.createReadStream($scope.file)
      .on("error", function (er) {
        console.error("Failed to read file", $scope.file, er)
        $scope.passwordError = true
        $scope.$apply()
      })
      .pipe(crypto.createDecipher("aes256", $scope.password))
      .on("error", function (er) {
        console.error("Failed to decipher", $scope.file, er)
        console.error(er.message)
        $scope.passwordError = true
        $scope.$apply()
      })
      .pipe(concat({encoding: "string"}, function (json) {
        try {
          $scope.keys = JSON.parse(json)
          $scope.key = $scope.keys[0]
          $("#password-modal").modal("hide")
        } catch (er) {
          console.log("Failed to parse", $scope.file, er)
          $scope.passwordError = true
        }
        $scope.$apply()
      }))
  }

  $scope.onSetPasswordKeyup = function (e) {
    if (e.keyCode == 13) $("#set-password-modal").modal("hide")
  }

  $scope.onFileChange = function (file, input) {
    var cipher = crypto.createCipher("aes256", $scope.password)
    var buf = cipher.update(JSON.stringify($scope.keys), "utf8")

    fs.writeFile(file, Buffer.concat([buf, cipher.final()]), function (er) {
      if (er) return console.error("Failed to write file", er)
      $scope.file = file
      $scope.$apply()
      input.value = ""
    })
  }

  var modal = null

  if ($location.search().file) {
    modal = $("#password-modal")
  } else {
    modal = $("#set-password-modal")
    $scope.addKey()
  }

  $scope.$evalAsync(function () {
    modal.modal("setting", {closable: false}).modal("show")
  })
}