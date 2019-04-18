const db = require('./models');

db.sequelize.sync().then(function(){
  db.bamazon.findAll({}).then(function(data){
    console.log('------------PRINTING DB DATA-----------------');
    console.log(JSON.stringify(data, null, 2));
  });
});