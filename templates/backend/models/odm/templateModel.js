module.exports = function( mongoose ) {
    var ModelSchema = new mongoose.Schema({
        name: String
    });

    return mongoose.model('{{Template}}', ModelSchema);
};