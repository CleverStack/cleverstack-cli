module.exports = function(Model) {
  return Model.extend('{{Template}}',
  {
    type: 'ORM',
    softDeletable: true,
    timeStampable: true
  },
  {
    id: {
      type: Number,
      primaryKey: true,
      autoIncrement: true
    },
    name: String
  });
};
