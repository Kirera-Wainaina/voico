exports.generateRandomName = function():string {

  return `${String(Math.round(Math.random() * 1e6))}-${Date.now()}`
}

exports.log = function(message: string) {
  console.log(`${Date()}; ${message}`)
}