(function () {
  var fs = require("fs")
    , path = require("path")
    , crypto = require("crypto")
    , shortid = require("shortid")
    , concat = require("concat-stream")
    , gui = require("nw.gui")

  function menu (onSaveClick, onSaveAsClick) {
    var menu = new gui.Menu({type: "menubar"})

    menu.createMacBuiltin("Keys")

    var fileMenu = new gui.Menu()

    fileMenu.append(new gui.MenuItem({label: "Save", click: onSaveClick, key: "s"}))
    fileMenu.append(new gui.MenuItem({label: "Save As...", click: onSaveAsClick}))

    menu.insert(new gui.MenuItem({
      label: "File",
      submenu: fileMenu
    }), 1)

    return menu
  }

  function openFile (filePath, password, cb) {
    var cbCalled = false

    function onError (er) {
      if (!cbCalled) cb(er)
      cbCalled = true
    }

    fs.createReadStream(filePath)
      .on("error", onError)
      .pipe(crypto.createDecipher("aes256", password))
      .on("error", onError)
      .pipe(concat({encoding: "string"}, function (json) {
        try {
          cb(null, JSON.parse(json))
        } catch (er) {
          cb(er)
        }
      }))
  }

  function saveFile (filePath, password, data, cb) {
    var cipher = crypto.createCipher("aes256", password)
    var buf = cipher.update(JSON.stringify(data), "utf8")
    fs.writeFile(filePath, Buffer.concat([buf, cipher.final()]), cb)
  }

  keys.controller("KeyList", function ($scope, $location) {
    $scope.password = null
    $scope.file = $location.search().file
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

      openFile($scope.file, $scope.password, function (er, keys) {
        if (er) {
          console.error("Failed to open file", $scope.file, er)
          $scope.passwordError = true
          return $scope.$apply()
        }

        $scope.keys = keys
        $scope.key = keys[0]
        $("#password-modal").modal("hide")
        $scope.$apply()
      })
    }
  
    $scope.onSetPasswordKeyup = function (e) {
      if (e.keyCode == 13) $("#set-password-modal").modal("hide")
    }

    $scope.onFileChange = function (file, input) {
      saveFile(file, $scope.password, $scope.keys, function (er) {
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

    function onSaveClick () {
      if ($scope.file) {
        saveFile($scope.file, $scope.password, $scope.keys, function (er) {
          if (er) console.error("Failed to write file", er)
        })
      } else {
        $("#key-list-save").click()
      }
    }

    function onSaveAsClick () {
      $("#key-list-save").click()
    }

    gui.Window.get().menu = menu(onSaveClick, onSaveAsClick)
  })
})()