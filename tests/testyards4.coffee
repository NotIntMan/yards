yards = require("../yards")
Package = yards.FileType.Package
Class = yards.API.Class
Module = yards.API.Module
fs = require("fs")
File = yards.API.File
PackageDir = undefined
PackageDir = Class(->
  self = this
  @struct = [[
    /.*/
    (path) ->
      if fs.lstatSync(path).isDirectory()
        return new PackageDir(path)
      else
        return new File(path)
  ]]
  return
, Module)
NodePackage = Class(->
  @module = PackageDir
  return
, Package)
y = new NodePackage("yards.package")
y.promise().then ->
  exists = y.$fileExists
  console.log "Exists:", exists
  if exists
    y.read().then ->
      console.log "File readed"
      y.writeToDir("../yards2").then ->
        console.log "Dir writed"
        return

      return

  else
    y.readFromDir("../yards").then (data) ->
      console.log "Dir readed"
      y.write().then ->
        console.log "File writed"
        return

      return

  return
