var gui = require("nw.gui")

module.exports = function () {
  var menu = new gui.Menu({type: "menubar"})

  menu.createMacBuiltin("Keys")

  return menu
}