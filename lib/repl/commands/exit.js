module.exports = function() {
  function Exit() {
    this.help    = 'Exits the CleverStack REPL';
    this.aliases = ['quit', 'q'];
  }

  Exit.prototype.action = function() {
    process.exit(0);
  };
  
  return Exit;
};
