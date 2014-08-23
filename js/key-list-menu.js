var gui = require("nw.gui")

module.exports = function () {
  var menu = new gui.Menu({type: "menubar"})

  var fileMenu = new gui.Menu()

  menu.append(new gui.MenuItem({
    label: "File",
    submenu: fileMenu
  }))

  menu.createMacBuiltin("Keys")

  return menu
}