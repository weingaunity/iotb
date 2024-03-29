# IoTB - IoT-Broker node module
created by DI Klaus Weichinger  snaky.1@gmx.at  

License: [GPLv3](./LICENSE)

Change-Log: [./doc/changelog.md](./doc/changelog.md)


## Installation
Setup a new IoT-Broker with following steps:

- sqlite3 is required. Maybe following lines have to be executed.

      sudo apt-get install libsqlite3-dev
      apt-get install sqlite3

- create a new directory e.g. `./iotbroker`

      mkdir iotbroker

- change to this directory

      cd ./iotbroker

- create a subdirectory `./db`

      mkdir db

- install the required iotb node-package from github with

      npm install github:weingaunity/iotb

- For web-pushnotifications a public and private key have to be generated with the command line tool [web-push](https://www.npmjs.com/package/web-push).

      sudo npm install -g web-push
      web-push generate-vapid-keys --json > webpushkeys.json

- copy the `servertemplate.js` to the local directory

      cp ./node_modules/iotb/templates/servertemplate.js ./server.js

- within the directory `./iotbroker` there is now the `server.js` with following content and change the settings marked with `//edit`.

```javascript
      var iotb = require('iotb');
      var webpushkeys=require('./webpushkeys.json');

      var iotbapp=iotb({
        port:8081, // optional edit
        systemadministrator:"iotadmin - <yourmail>", //edit
        defaultadmin:{
          user: "iotadmin",                     // edit
          username: "IoT Broker Administrator", // edit
          password: "<yourpwd>",                // edit
          email: "<yourmail>"                   // edit
        },
        dbfile:"./db/iot.db",       
        webpush:{
          // copy content from keys.txt generated by web-push
          publickey: webpushkeys.publicKey,
          privatekey: webpushkeys.privateKey,
          email: "<yourmail>" // edit
        },
        limits:{  // default settings, can be changed
          zipfileupload_mb:5,
          websitetotalsize_mb:10
        }
      });

      var app=iotbapp.express;

      iotbapp.run().then(()=>{
        console.log("IoT Broker listening on port "+iotbapp.config.port);
        let events = [
          {name: 'beforeExit', exitCode: 0 },
          {name: 'uncaughtExecption', exitCode: 1 },
          {name: 'SIGINT', exitCode: 130 },
          {name: 'SIGTERM', exitCode: 143 }
        ];

        events.forEach((e) => {
          process.on(e.name,  () => {
          iotbapp.stop()
            .then(() => { 
              console.log('connection cleaned');
              process.exit(e.exitCode);
            })
            .catch((err) => {
              console.error(err);
              process.exit(1);
            })    
          })
        });
      }).catch((e)=>{
        console.log("Error loading IoT Broker");
      });
```

## Run

Run the broker with following line

    node ./server.js

The web-interface of the broker can be opened within the browser with `localhost:8081` (or the port you selected).

## Hints

The `iotbapp` application object contains the membervariable `express` that contains the express application object of the broker. This express object can be used for custom API.

## PM2 Config
Do not use global watch, because changes in database ends up in reset

execute the following line within the `./iotbroker` directory, otherwise there will be an issue to access the database (maybe wrong process path)

    sudo pm2 start --name IoTBroker ./server.js


    sudo pm2 startup (only one time required)
    sudo pm2 save

Test default configuration with

    sudo pm2 resurrect

## Optional Settings within the IoT-Broker

Further optional configurations can be done with an additional thing called `brokersettings`.

Type in the top commandline of the web-interface following command:

    creatething:brokersettings

The following default config script

```javascript
    if (action=="broker")
    {
      // sortcut urls
      // https://brokerdomain/s/shorty
      links={
        shorty:"long-url",
      };
      res=links[value];
    }
    if (action=="http")
    {
      if (name=="favorites")
      {
        // favorite view of the broker site
        res={
          type:"favorites",
          title:"Title of the Favorites",
          titleimagewidth:"220px",
          // base64 image
          titleimage:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAX8AAABrCAYA...",
          list:[
            {label: "App 1", description:"App Description", href:"https://..."},
            {label: "App 2", description:"App Description", href:"https://..."}
          ]
        };
      }
    }
  ```
    
