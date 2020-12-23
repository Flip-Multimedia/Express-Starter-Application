const express = require('express');
const fs = require('fs');
const hbs = require('express-hbs');
const Database = require('./lib/database');


/**
 *
 *
 */
async function main() {
  console.log('Loading...');
  const app = express();

  // HBS render engine.
  app.engine('hbs', hbs.express4({
    defaultLayout: './views/layout',
    partialsDir: './views/partials'
  }));
  app.set('view engine', 'hbs');
  
  // default route and endpoint
  app.use('/', require('./routes/index'));
  app.use('/api', require('./endpoints/index'));

  // load router controllers into express application.
  for(let file of fs.readdirSync('./routes')) {
    if(fs.statSync(`./routes/${file}`).isDirectory()) {

      for(let subFile of fs.readdirSync(`./routes/${file}`)) {
        if(fs.statSync(`./routes/${file}/${subFile}`).isFile()) {
          console.log(`Loading route /${file}/${subFile} -> ${subFile}`);
          app.use(`/${file}/${subFile}`, require(`./routes/${file}/${subFile}`));

        }
      }

    }
    else if(!file === 'index.js') {
      console.log(`Loading route /${file.split('.js')[0]} -> ${file}`);
      app.use(`/${file.split('.js')[0]}`, require(`./routes/${file}`));
    }
  }

  // load API endpoint controllers into express application.
  for(let file of fs.readdirSync('./endpoints')) {
    if(fs.statSync(`./endpoints/${file}`).isDirectory()) {

      for(let subFile of fs.readdirSync(`./routes/${file}`)) {
        if(fs.statSync(`./endpoints/${file}/${subFile}`).isFile()) {
          console.log(`Loading endpoint /${file}/${subFile} -> ${subFile}`);
          app.use(`/${file}/${subFile}`, require(`./endpoints/${file}/${subFile}`));

        }
      }

    }
    else if(!file === 'index.js') {
      console.log(`Loading endpoint /${file.split('.js')[0]} -> ${file}`);
      app.use(`/${file.split('.js')[0]}`, require(`./endpoints/${file}`));
    }
  }

  // establish connnection to database server, and attach to express app.
  console.log('Connecting to database');
  const database = new Database();
  app.db = database.establishDatabaseConnection();

  app.listen(80, () => {
    console.log('Ready!');
  });

}

new Promise(async () => {
  try {
    await main();
  }
  catch(error) {
    throw error;
  }
});