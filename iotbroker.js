// *********************************************************************
// IoTB - IoT-Broker
// Copyright (C) 2018  Weichinger Klaus, snaky.1@gmx.at
// Project web-page: https://npmjs.com/package/iotb
//
// License:  GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
// http://www.gnu.org/licenses/
// *********************************************************************
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
// *********************************************************************
// Dedication
// **********
//  I dedicate this piece of software our beloved
//  son Gregor, who died suddenly 2015.
//
//     +-----+
//     |      \    #
//     |Gregor +---#--+
//    _|___ Weichinger \
//   /     \  2012-2015 |
//  |   O   |----/   \--+
//   \     /     \   /
//  ###############################

var packagejson=require('./package.json');


var express = require('express');
var session = require('express-session');
var path=require('path');
var AdmZip = require('adm-zip');
var mime = require('mime-types');
const fs = require('fs');
var multer  = require('multer');
const webpush = require("web-push"); // DA
const fetch = require('node-fetch');
var URL=require("url").URL;

var iotb = function(brokersettings)
{
  const publicVapidKey = brokersettings.webpush.publickey;
  const privateVapidKey = brokersettings.webpush.privatekey;

  var zipfilelimit_mb=brokersettings.zipfileupload_mb;
  var websitelimit_mb=brokersettings.websitetotalsize_mb;

  var uploadService = multer({storage: multer.memoryStorage(), limits: {fileSize: 1000 * 1000 * zipfilelimit_mb}}).single('fileToUpload');

  var thingscriptcompiler=require('./thingscript.js');

  var mimeTypes = {
      '.html' : 'text/html',
      '.js' : 'text/javascript',
      '.txt' : 'text/plain',
      '.css' : 'text/css',
      '.gif' : 'image/gif',
      '.ico' : 'image/x-icon'
  };


  function utf8_encode(s) {
      return unescape(encodeURIComponent(s));
  }

  function sha1(str) {
      //  discuss at: http://phpjs.org/functions/sha1/
      // original by: Webtoolkit.info (http://www.webtoolkit.info/)
      // improved by: Michael White (http://getsprink.com)
      // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      //    input by: Brett Zamir (http://brett-zamir.me)
      //  depends on: utf8_encode
      //   example 1: sha1('Kevin van Zonneveld');
      //   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

      var rotate_left = function(n, s) {
          var t4 = (n << s) | (n >>> (32 - s));
          return t4;
      };

      /*var lsb_hex = function (val) { // Not in use; needed?
        var str="";
        var i;
        var vh;
        var vl;

        for ( i=0; i<=6; i+=2 ) {
          vh = (val>>>(i*4+4))&0x0f;
          vl = (val>>>(i*4))&0x0f;
          str += vh.toString(16) + vl.toString(16);
        }
        return str;
      };*/

      var cvt_hex = function(val) {
          var str = '';
          var i;
          var v;

          for (i = 7; i >= 0; i--) {
              v = (val >>> (i * 4)) & 0x0f;
              str += v.toString(16);
          }
          return str;
      };

      var blockstart;
      var i, j;
      var W = new Array(80);
      var H0 = 0x67452301;
      var H1 = 0xEFCDAB89;
      var H2 = 0x98BADCFE;
      var H3 = 0x10325476;
      var H4 = 0xC3D2E1F0;
      var A, B, C, D, E;
      var temp;

      str = utf8_encode(str);
      var str_len = str.length;

      var word_array = [];
      for (i = 0; i < str_len - 3; i += 4) {
          j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
          word_array.push(j);
      }

      switch (str_len % 4) {
          case 0:
              i = 0x080000000;
              break;
          case 1:
              i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
              break;
          case 2:
              i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
              break;
          case 3:
              i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
                  8 | 0x80;
              break;
      }

      word_array.push(i);

      while ((word_array.length % 16) != 14) {
          word_array.push(0);
      }

      word_array.push(str_len >>> 29);
      word_array.push((str_len << 3) & 0x0ffffffff);

      for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
          for (i = 0; i < 16; i++) {
              W[i] = word_array[blockstart + i];
          }
          for (i = 16; i <= 79; i++) {
              W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
          }

          A = H0;
          B = H1;
          C = H2;
          D = H3;
          E = H4;

          for (i = 0; i <= 19; i++) {
              temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
              E = D;
              D = C;
              C = rotate_left(B, 30);
              B = A;
              A = temp;
          }

          for (i = 20; i <= 39; i++) {
              temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
              E = D;
              D = C;
              C = rotate_left(B, 30);
              B = A;
              A = temp;
          }

          for (i = 40; i <= 59; i++) {
              temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
              E = D;
              D = C;
              C = rotate_left(B, 30);
              B = A;
              A = temp;
          }

          for (i = 60; i <= 79; i++) {
              temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
              E = D;
              D = C;
              C = rotate_left(B, 30);
              B = A;
              A = temp;
          }

          H0 = (H0 + A) & 0x0ffffffff;
          H1 = (H1 + B) & 0x0ffffffff;
          H2 = (H2 + C) & 0x0ffffffff;
          H3 = (H3 + D) & 0x0ffffffff;
          H4 = (H4 + E) & 0x0ffffffff;
      }

      temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
      return temp.toLowerCase();
  }

  var pwdsalt=function(pwd)
  {
    return sha1("IoT_Salt!"+pwd+"(1);");
  };

  const Sequelize = require('sequelize');
  var dbfilename=path.join(process.cwd(), brokersettings.dbfile);
  const sequelize = new Sequelize({
    logging: false,
    dialect: 'sqlite',
    storage: dbfilename
  });

  const dbUsers = sequelize.define('user', {
    user: { type: Sequelize.TEXT, primaryKey: true, unique: true },
    username: { type: Sequelize.TEXT},
    password: { type: Sequelize.TEXT},
    email: {type: Sequelize.TEXT},
    enabled: { type: Sequelize.BOOLEAN},
    admin: { type: Sequelize.BOOLEAN}
  });

  const dbKeys = sequelize.define('key', {
    key: { type: Sequelize.TEXT, primaryKey: true, unique: true },
    token: { type: Sequelize.TEXT},
    enabled: { type: Sequelize.BOOLEAN},
    owners: { type: Sequelize.TEXT},
    tags: { type: Sequelize.TEXT},
    description: { type: Sequelize.TEXT}
  });

  const dbThings = sequelize.define('thing', {
    thing: { type: Sequelize.TEXT, primaryKey: true, unique: true },
    source: { type: Sequelize.TEXT},
    enabled: { type: Sequelize.BOOLEAN},
    owners: { type: Sequelize.TEXT},
    tags: { type: Sequelize.TEXT},
    description: { type: Sequelize.TEXT}
  });

  const dbThingDbVars = sequelize.define('thingdbvars', {
    thing:   { type: Sequelize.TEXT, primaryKey: true, unique: true },
    varname: { type: Sequelize.TEXT, primaryKey: true },
    value: { type: Sequelize.TEXT} // JSON formated value
  });

  const dbWebSites = sequelize.define('website',{
    website: {type: Sequelize.TEXT, primaryKey: true, unique: true},
    enabled: { type: Sequelize.BOOLEAN},
    owners: { type: Sequelize.TEXT},
    tags: { type: Sequelize.TEXT},
    description: { type: Sequelize.TEXT}
  });

  const dbWebSiteFiles = sequelize.define('websitefiles',{
    website:    {type: Sequelize.TEXT, primaryKey: true},
    filepath:   {type: Sequelize.TEXT, primaryKey: true},
    content:    { type: Sequelize.BLOB}
  },{
    uniqueKeys: {files_unique: {fields:['website','filepath']}}
  });

  const dbSubscriptions = sequelize.define('subscription',{
    endpoint: { type: Sequelize.TEXT, primaryKey: true, unique: true },
    data: { type: Sequelize.TEXT } // json object
  });

  var app = express();

  webpush.setVapidDetails(
    "mailto: "+brokersettings.webpush.email,
    publicVapidKey,
    privateVapidKey
  );

  var sendPushNotification=function(sub,obj) {
    webpush.sendNotification(sub, JSON.stringify(obj))
    .then(function(){
      subscriptions[sub.endpoint].lastokunixtime=Date.now();
      subscriptions[sub.endpoint].trycounter=0;
      var dbdata={
        endpoint: sub.endpoint,
        data: JSON.stringify(subscriptions[sub.endpoint])
      };
      dbSubscriptions.upsert(dbdata).then(test=>{
      });
    })
    .catch(function(){
      subscriptions[sub.endpoint].error=Date.now();
      subscriptions[sub.endpoint].trycounter+=1;
      if ((Date.now() > (subscriptions[sub.endpoint].lastokunixtime+ 1000*60*60*24*14)) && (subscriptions[sub.endpoint].trycounter>4)) // delete subscription if last valid command was 14 days ago
      {
        dbSubscriptions.destroy({where:{endpoint: sub.endpoint}}).then(function(response){
          delete subscriptions[sub.endpoint];
        });  
      }
      else
      {
        var dbdata={
          endpoint: sub.endpoint,
          data: JSON.stringify(subscriptions[sub.endpoint])
        };
        dbSubscriptions.upsert(dbdata).then(test=>{
        });  
      }
    });
  };


  var subscriptions ={};

  var users={};

  var things={};

  var keys={};

  var websites={};

  var statistics={totalcalls:{http:0, init:0, thing:0, tick:0}};

  var loadSubscriptionsFromDB=function(nextevent)
  {
    dbSubscriptions.findAll().then(list => {
      console.log("Subscriptions "+list.length+" found in DB!");
      for(var index in list)
      {
        var sub=list[index];
        subscriptions[sub.endpoint]=JSON.parse(sub.data);
        if (subscriptions[sub.endpoint].hasOwnProperty("lastokunixtime")==false)
        {
          subscriptions[sub.endpoint].lastokunixtime=Date.now();
        }
        if (subscriptions[sub.endpoint].hasOwnProperty("trycounter")==false)
        {
          subscriptions[sub.endpoint].trycounter=0;
        }
      }
      if (nextevent) nextevent();
    });
  };

  var loadUsersFromDB=function(nextevent)
  {
    dbUsers.findAll().then(list => {
      console.log("Users "+list.length+" found in DB!");
      for(var index in list)
      {
        var user=list[index];
        var res=setUserData(null,{user: user.user, username: user.username, password: user.password, email: user.email, enabled: user.enabled, admin: user.admin},
                    {loadFromDB: true, onfinished:function(obj){}, onerror:function(err){}});
        if (res===true)
        {

        }
        else
        {
          console.log(res);
        }
      }
      if (list.length==0)
      {
        // default passwort is "iot"
  //      setUserData("iotadm",{user: "iotadm", username: "IoT Broker Administrator", email: "iot@test.com", newpassword1: "0bbc55a4d7b944ccc0220e50299b4df110d16c5e", newpassword2: "0bbc55a4d7b944ccc0220e50299b4df110d16c5e"},{setAdmin: true, setEnabled: true, createUser: true, onfinished:function(obj){console.log("Admin user created");}, onerror:function(err){console.log("Error: Admin user was not created!");}})
        var defaultadmin=brokersettings.defaultadmin;
        var pwdhash=pwdsalt(defaultadmin.password);
        setUserData(defaultadmin.user,{user: defaultadmin.user, username: defaultadmin.username, email: defaultadmin.email, newpassword1: pwdhash, newpassword2: pwdhash},{setAdmin: true, setEnabled: true, createUser: true, onfinished:function(obj){console.log("Admin user created");}, onerror:function(err){console.log("Error: Admin user was not created!");}})
      }
      if (nextevent) nextevent();
    });
  };

  var loadWebSitesFromDB=function(nextevent)
  {
    dbWebSites.findAll().then(list => {
      console.log("Websites "+list.length+" found in DB!");
      for(var index in list)
      {

        var website=list[index];
        var res=setWebSiteData(null,{
            website: website.website,
            enabled: website.enabled,
            owners: JSON.parse(website.owners),
            tags: JSON.parse(website.tags),
            description: website.description
          },{loadFromDB: true});
        if (res===true)
        {

        }
        else {

        }
      }
      if (nextevent) nextevent();
    });
  };

  var loadKeysFromDB=function(nextevent)
  {
    dbKeys.findAll().then(list => {
      console.log("Keys "+list.length+" found in DB!");
      for(var index in list)
      {

        var key=list[index];
        var res=setKeyData(null,{
            key: key.key,
            token: key.token,
            enabled: key.enabled,
            owners: JSON.parse(key.owners),
            tags: JSON.parse(key.tags),
            description: key.description
          },{loadFromDB: true});
        if (res===true)
        {

        }
        else {

        }
      }
      if (nextevent) nextevent();
    });
  };

  var loadThingsFromDB=function(nextevent)
  {
    dbThings.findAll().then(list => {
      console.log("Things "+list.length+" found in DB!");
      for(var index in list)
      {
        var thing=list[index];
        var res=setThingData(null,{
            thing: thing.thing,
            source: thing.source,
            enabled: thing.enabled,
            owners: JSON.parse(thing.owners),
            tags: JSON.parse(thing.tags),
            description: thing.description
          },{loadFromDB: true});
        if (res===true)
        {

        }
        else {

        }
      }
      if (nextevent) nextevent();
    });
  };

  var dumpUsers2Files=function()
  {
    for(var _user in users)
    {
      var user=users[_user];
      var res={};
      res.user=_user;
      res.username=user.username;
      res.password=user.password;
      res.email=user.email;
      res.enabled=user.enabled;
      res.admin=(user.admin===true)?true:false;
      var json=JSON.stringify(res);
      fs.writeFile('./db/users/user.'+_user+'.json', json, 'utf8',function(){console.log("Dumped: "+res.user)});
    }
  };

  var isNameValid=function(name,minlength)
  {
    var allowedchars="abcdefghijklmnopqrstuvwxyz0123456789-._";
    if (name.length<minlength) return false;
    for(var i=0;i<name.length;i++)
    {
      if (allowedchars.indexOf(name[i])<0) return false;
    }
    return true;
  }

  var iotscriptfunctions={

    isAdmin: function(context,args)
    {
      var res=false;
      if (args.length==1)
      {
        var user=args[0]();
        res= (users.hasOwnProperty(user) && users[user].admin===true);
      }
      return res;
    },

    isUser: function(context,args)
    {
      var res=false;
      if (args.length==1)
      {
        var user=args[0]();
        res=(users.hasOwnProperty(user));
      }
      return res;
    },

    getBrokerStatistics: function(context, args)
    {
      return JSON.parse(JSON.stringify(statistics));
    },

    isValue: function(context,args)
    {
      return (context.scriptvars.hasOwnProperty('value'))?true:false;
    },


    isKeyToken: function(context,args)
    {
      return (context.request.hasOwnProperty('keytoken'))?true:false;
    },

    usedKey: function(context,args)
    {
      if(context.request.hasOwnProperty('keytoken'))
      {
        if (args.length==1)
        {
          var keyname=args[0]();
          if (typeof keyname==="string")
          {
            if (keys[keyname].enabled==false) return false;
            var keytoken=keyname+":"+keys[keyname].token;
            if (context.request.hasOwnProperty('keytoken') && keytoken==context.request.keytoken) return true;
          }
          else if (typeof keyname==="object")
          {
            if (Array.isArray(keyname))
            {
              for(var i=0;i<keyname.length;i++)
              {
                if (keys[keyname[i]].enabled==true)
                {
                  var keytoken=keyname[i]+":"+keys[keyname[i]].token;
                  if ( keytoken==context.request.keytoken)
                  {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
      return false;
    }
  };

  var getUserPassword=function(user)
  {
    if (users[user]) return users[user].password;
    return null;
  };

  var checkUserLogin=function(user, password)
  {
    if (users[user] && users[user].enabled===true && users[user].password===password) return true;
    return false;
  }

  var getUserData=function(user){
    var res={};
    if (users[user])
    {
      res.type="user";
      res.user=user;
      res.username=users[user].username;
      res.email=users[user].email;
      res.enabled=users[user].enabled;
      res.admin=users[user].admin;
      res.oldpassword="";
      res.newpassword1="";
      res.newpassword2="";
    }
    return res;
  };

  var setUserData=function(user, userdata, options)
  {
    if (isNameValid(userdata.user,4)==false) return "Invalid user name: "+userdata.user;

    // prepage options


    var opt={createUser: false, loadFromDB: false, onfinished: function(newkey){}, onerror: function(errno){}};
    if (options && options.hasOwnProperty('createUser')) opt.createUser=options.createUser;
    if (options && options.hasOwnProperty('loadFromDB')) opt.loadFromDB=options.loadFromDB;
    if (options && options.hasOwnProperty('onfinished')) opt.onfinished=options.onfinished;
    if (options && options.hasOwnProperty('onerror')) opt.onerror=options.onerror;
    if (options && options.hasOwnProperty('setAdmin')) opt.setAdmin=options.setAdmin;
    if (options && options.hasOwnProperty('setEnabled')) opt.setEnabled = options.setEnabled;

    var allowed=false;

    if (users[userdata.user] && (user === userdata.user)) allowed=true;
    if ((opt.createUser===true) && !users[userdata.user]) allowed=true;
    if (users[user] && users[user].admin===true && users[user].enabled===true) allowed=true;

    if (opt.loadFromDB===true) allowed=true; // load key from DB

    if (allowed)
    {
      var newuser={};
      if (users[userdata.user]) newuser=users[userdata.user];

      // username =================================
      if (userdata.username) newuser.username=userdata.username;

      // password =================================
      // load from db
      if (userdata.password && (opt.loadFromDB===true)) newuser.password=userdata.password;
      // modified by admin
      if (   users[user] && users[user].enabled===true && users[user].admin===true && users[userdata.user]
          && userdata.newpassword1
          && userdata.newpassword2
        )
      {
        if(userdata.newpassword1==userdata.newpassword2)
        {
          newuser.password=userdata.newpassword1;
        }
        else
        {
          // wrong input
          opt.onerror(11);
          return "Issue with one of the entered passwordsxxx!";
        }
      }
      // modified by user
      else if (   users.hasOwnProperty(userdata.user)
          && userdata.hasOwnProperty("oldpassword")
          && userdata.hasOwnProperty("newpassword1")
          && userdata.hasOwnProperty("newpassword2")
        )
        {
          if((users[userdata.user].password == userdata.oldpassword) && userdata.newpassword1==userdata.newpassword2)
          {
            newuser.password=userdata.newpassword1;
          }
          else
          {
            // wrong input
            opt.onerror(11);
            return "Issue with one of the entered passwords!";
          }
        }

      // create user (first user per script)
      if ( (opt.createUser===true)
          && userdata.hasOwnProperty("newpassword1")
          && userdata.hasOwnProperty("newpassword2")
          && userdata.newpassword1==userdata.newpassword2
        ) newuser.password=userdata.newpassword1;

      // email ========================
      if (userdata.email) newuser.email=userdata.email;

      // enabled ========================
      if (!newuser.enabled) newuser.enabled=false; // default value // issue here!!!
      if (userdata.enabled && opt.loadFromDB) newuser.enabled=userdata.enabled;
      if (opt.setEnabled) newuser.enabled=opt.setEnabled;
      if ( users[user] && users[user].enabled===true && users[user].admin===true && (userdata.enabled===true || userdata.enabled===false)) newuser.enabled=userdata.enabled;

      // admin ==========================
      if (!newuser.enabled) newuser.admin=false; // default value
      if (userdata.admin && opt.loadFromDB) newuser.admin=userdata.admin;
      if (opt.setAdmin) newuser.admin=opt.setAdmin;
      if ( users[user] && users[user].enabled===true && users[user].admin===true && (userdata.admin===true || userdata.admin===false)) newuser.admin=userdata.admin;

      users[userdata.user]=newuser;

      if (opt.loadFromDB===false)
      {
        // write key to database
        var data={user: userdata.user,
          username: newuser.username,
          password: newuser.password,
          email: newuser.email,
          enabled: newuser.enabled,
          admin: newuser.admin
        };
        try {
          dbUsers.upsert(data).then(test=>{
  /*
            if (test===true) console.log("User upsert=true;");
            else if (test===false) console.log("User upsert=false;");
            else { console.log("User test=");console.log(test);}
  */
            opt.onfinished(newuser);
  /*
            if (test)
            {
              opt.onfinished(newuser);
            }
            else
            {
              opt.onerror(10);
            }
  */
          });
        }
        catch(err)
        {
          opt.onerror(11);
          return "Database issue!";
        }
        return true;
      }
      else
      {
        // key loaded from database into keys object
        opt.onfinished(newuser);
      }
      return true;
    }
    options.onerror(20);
    return false;
  }

  var setWebSiteData=function(user, website, options)
  {
    if (isNameValid(website.website,6)==false) return "Invalid website name: "+website.website;

    // prepage options
    var opt={loadFromDB: false, onfinished: function(newwebsite){}, onerror: function(errno){}};
    if (options && options.hasOwnProperty('loadFromDB')) opt.loadFromDB=options.loadFromDB;
    if (options && options.hasOwnProperty('onfinished')) opt.onfinished=options.onfinished;
    if (options && options.hasOwnProperty('onerror')) opt.onerror=options.onerror;

    if (website.owners.length==0)
    {
      // websites without an owner in the database will not
      // be available, but not deleted
      opt.onerror(1);
      return "Website with no owner are not allowed!";
    }

    var allowed=false;

    if ( websites[website.website] && websites[website.website].owners.indexOf(user)>=0)
    {
      // existing website and user is owner
      allowed=true;
    }

    if (!websites[website.website] && website.owners && website.owners.indexOf(user)>=0)
    {
      // new website and user is owner
      allowed=true;
    }

    if (opt.loadFromDB===true) allowed=true; // load key from DB

    if (allowed)
    {
      for(var i=0;i<website.owners.length;i++)
      {
        if (!users[website.owners[i]])
        {
          opt.onerror(2);
          return "Invalid username as owner: "+website.owners[i];
        }
      }
      var newwebsite={};
      newwebsite.enabled=(website.enabled===true || website.enabled===false)?website.enabled: true;
      newwebsite.owners=website.owners;
      newwebsite.tags=website.tags || [];
      newwebsite.description=website.description || "";
      websites[website.website]=newwebsite;

      if (opt.loadFromDB===false)
      {
        try
        {
          // write website to database
          dbWebSites.upsert(
            {website: website.website,
            enabled: newwebsite.enabled,
            owners: JSON.stringify(newwebsite.owners),
            tags: JSON.stringify(newwebsite.tags),
            description: newwebsite.description
            }).then(test=>{
              if (test===true)
              {
                opt.onfinished(newwebsite);
              }
              else
              {
                opt.onerror(10);
              }
            });
        }
        catch(err)
        {
          opt.onerror(11);
          return "Database issue!";
        }
        return true;
      }
      else
      {
        // key loaded from database into keys object
        opt.onfinished(newwebsite);
      }
      return true;
    }
    options.onerror(20);
    return false;
  }

  var getWebSiteData=function(user,websitename,opt)
  {
    var res=null;
    if (websites[websitename] && websites[websitename].hasOwnProperty("owners") && websites[websitename].owners.indexOf(user)>=0)
    {
      res={};
      res.type="website";
      res.website=websitename;
      res.enabled=websites[websitename].enabled;
      res.owners=websites[websitename].owners;
      res.tags=websites[websitename].tags;
      res.description=websites[websitename].description;
    }
    return res;
  };

  var setWebSiteItem=function(user, item, options)
  {
    var res=null;
    var websitename=item.website;

    var opt={onfinished: function(newkey){}, onerror: function(errno){}};
    if (options && options.hasOwnProperty('onfinished')) opt.onfinished=options.onfinished;
    if (options && options.hasOwnProperty('onerror')) opt.onerror=options.onerror;

    if (websites[websitename] && websites[websitename].hasOwnProperty("owners") && websites[websitename].owners.indexOf(user)>=0)
    {
      if (item.type=="websitedirectory")
      {
        try
        {
          // write website to database
          dbWebSiteFiles.upsert(
            {website: item.website,
            filepath: item.filepath.substr(1)
            }).then(test=>{
              if (test===true)
              {
                opt.onfinished(null);
              }
              else
              {
                opt.onerror(10);
              }
            });
            res=true;
        }
        catch(err)
        {
          opt.onerror(11);
          return "Database issue!";
        }
        return true;
      }
      else if (item.type=="websitefile")
      {
        try
        {
          // write website to database
          dbWebSiteFiles.upsert(
            {website: item.website,
            filepath: item.filepath.substr(1),
            content:Buffer.from(item.content)
            })
            .then(test=>{
              if (test===true)
              {
                opt.onfinished(null);
              }
              else
              {
                opt.onerror(10);
              }
            });
          res=true;
        }
        catch(err)
        {
          opt.onerror(11);
          return "Database issue!";
        }
      return true;
      }
    }
    return res;
  };

  var getWebSiteItem=function(user, websitename, filepath, onload, onerror)
  {
    var res=null;
    if (websites[websitename] && websites[websitename].hasOwnProperty("owners") && websites[websitename].owners.indexOf(user)>=0)
    {
      res={};
      res.website=websitename;
      res.filepath=filepath;
      res.parentdirectory="";
      if (filepath.endsWith("/"))
      {
        res.type="websitedirectory";
        if (filepath!='/')
        {
          var parentdirectory=filepath.substr(0,filepath.length-1);
          while(parentdirectory.length>0)
          {
            if (parentdirectory[parentdirectory.length-1]=="/") break;
            parentdirectory=parentdirectory.substr(0,parentdirectory.length-1);
          }
          res.parentdirectory=parentdirectory;
        }
        res.files=[];
        res.directories=[];
        console.log("A "+websitename+" "+filepath);
        console.log(res);
        dbWebSiteFiles.findAll({where:{website: websitename}}).then(list=>{
          console.log("B");
          for(var i=0;i<list.length;i++)
          {
            var itempath="/"+list[i].filepath;
            if (itempath.startsWith(filepath))
            {
              var itemname=itempath.substr(filepath.length);
              if (itemname.length>0)
              {
                if (itemname.indexOf("/")>0 && itemname.indexOf("/")==(itemname.length-1))
                {
                  res.directories.push({name: itemname.substr(0,itemname.indexOf("/")), path: "."+itempath});
                }
                else if (itemname.indexOf("/")<0)
                {
                  res.files.push({name: itemname, path: "."+itempath});
                }
              }
            }
          }
          onload(res);
        }).catch(function(error){
          onerror(error);
        });
      }
      else
      {
        res.type="websitefile";
        dbWebSiteFiles.findAll({where:{website: websitename, filepath: filepath.substr(1)}}).then(list=>{
          if (list.length==1)
          {
            res.content=Buffer.from(list[0].content).toString();
            res.mime=mime.lookup(filepath);
            res.extension=path.extname(filepath).substr(1);
            onload(res);
          }
          else
          {
            onerror();
          }
        }).catch(function(error){
          onerror();
        });
      }
    } else onload(res);
  }

  var setKeyData=function(user,key,options)
  {
    if (isNameValid(key.key,6)==false) return "Invalid key name: "+key.key;

    // prepage options
    var opt={loadFromDB: false, onfinished: function(newkey){}, onerror: function(errno){}};
    if (options && options.hasOwnProperty('loadFromDB')) opt.loadFromDB=options.loadFromDB;
    if (options && options.hasOwnProperty('onfinished')) opt.onfinished=options.onfinished;
    if (options && options.hasOwnProperty('onerror')) opt.onerror=options.onerror;

    if (key.owners.length==0)
    {
      // keys without an owner in the database will not
      // be available, but not deleted
      opt.onerror(1);
      return "Key with no owner are not allowed!";
    }

    var allowed=false;

    // required for explicit create key
  //  var createonly=(key._saveoptions && key._saveoptions.createonly && key._saveoptions.createonly==true)?true:false;

    if ( keys[key.key] && keys[key.key].owners.indexOf(user)>=0)
    {
      // existing thing and user is owner
      allowed=true;
    }

    if (!keys[key.key] && key.owners && key.owners.indexOf(user)>=0)
    {
      // new thing and user is owner
      allowed=true;
    }

    if (opt.loadFromDB===true) allowed=true; // load key from DB

    if (allowed)
    {
      for(var i=0;i<key.owners.length;i++)
      {
        if (!users[key.owners[i]])
        {
          opt.onerror(2);
          return "Invalid username as owner: "+key.owners[i];
        }
      }
      var newkey={};
      newkey.token=key.token;
      newkey.enabled=(key.enabled===true || key.enabled===false)?key.enabled: true;
      newkey.owners=key.owners;
      newkey.tags=key.tags || [];
      newkey.description=key.description || "";
      keys[key.key]=newkey;

      if (opt.loadFromDB===false)
      {
        try
        {
          // write key to database
          dbKeys.upsert(
            {key: key.key,
            token: newkey.token,
            enabled: newkey.enabled,
            owners: JSON.stringify(newkey.owners),
            tags: JSON.stringify(newkey.tags),
            description: newkey.description
            }).then(test=>{
              if (test===true)
              {
                opt.onfinished(newkey);
              }
              else
              {
                opt.onerror(10);
              }
            });
        }
        catch(err)
        {
          opt.onerror(11);
          return "Database issue!";
        }
        return true;
      }
      else
      {
        // key loaded from database into keys object
        opt.onfinished(newkey);
      }
      return true;
    }
    options.onerror(20);
    return false;
  }

  var getKeyData=function(user,keyname)
  {
    var res=null;
    if (keys[keyname] && keys[keyname].owners && keys[keyname].owners.indexOf(user)>=0)
    {
      res={};
      res.type="key";
      res.key=keyname;
      res.enabled=keys[keyname].enabled;
      res.token=keys[keyname].token;
      res.owners=keys[keyname].owners;
      res.tags=keys[keyname].tags;
      res.description=keys[keyname].description;
    }
    return res;
  }


  var setThingData=function(user,thing,options)
  {
    if (isNameValid(thing.thing,6)==false) return "Invalid thing name: "+thing.thing;

    // prepage options
    var opt={loadFromDB: false, onfinished: function(newkey){}, onerror: function(errno){}};
    if (options && options.loadFromDB) opt.loadFromDB=options.loadFromDB;
    if (options && options.onfinished) opt.onfinished=options.onfinished;
    if (options && options.onerror) opt.onerror=options.onerror;


    if (thing.owners.length==0)
    {
      // thing without an owner in the database will not
      // be available, but not deleted
      opt.onerror(1);
      return "Thing with no owner are not allowed!";
    }
    var allowed=false;

    if ( things[thing.thing] && things[thing.thing].owners.indexOf(user)>=0)
    {
      // existing thing and user is owner
      allowed=true;
    }

    if (!things[thing.thing] && thing.owners && thing.owners.indexOf(user)>=0)
    {
      // new thing and user is owner
      allowed=true;
    }

    if (opt.loadFromDB===true) allowed=true; // load thing from DB

    if (allowed)
    {
      for(var i=0;i<thing.owners.length;i++)
      {
        if (!users[thing.owners[i]]) {
          opt.onerror(2);
          return "Invalid username as owner: "+thing.owners[i];
        }
      }
      var thingname=thing.thing;
      var newthing={};
      newthing.enabled=(thing.enabled===true || thing.enabled===false)?thing.enabled: true;
      newthing.source=thing.source;
      newthing.owners=thing.owners;
      newthing.tags=thing.tags || [];
      newthing.description=thing.description || "";
      newthing.ramvars={};
      newthing.events=[];

      var scriptoptions={
        functions: iotscriptfunctions,
      };

      scriptoptions.functions.httpRequest=function(context,args)
      {
        if (args.length==3)
        {
          var method=args[0]();
          var url = new URL(args[1]());
          var props=args[2]();
          var options={
            method:method,
          };
          if (props.hasOwnProperty("jsonbody"))
          {
            var jsonbody=props["jsonbody"];
            try{
              options.body=JSON.stringify(jsonbody);
              options.headers={
                'Content-Type': 'application/json'
              };
            }
            catch(e)
            {
            }
          }
          else if (props.hasOwnProperty("body"))
          {
            options.body=props["body"];
          }
          if (props.hasOwnProperty("headers"))
          {
            options.headers=props.headers;
          }
          if (props.hasOwnProperty("query"))
          {
            Object.keys(props.query).forEach(key => url.searchParams.append(key, props.query[key]));
          }
          fetch(url,options)
          .then(res => res.text())
          .then(body => {
            if (props.hasOwnProperty("eventid"))
            {
              var event={
                id:props.eventid,
                body:body,
                unixtime:Date.now()
              }
              try{
                event.json=JSON.parse(body);
              }
              catch(e)
              {
              }
              newthing.events.push(event);
              if (newthing.events.length>10)
              {
                newthing.events.shift();
              }
            }
          }).catch(function(error){
          });
        }
        // "GET","https://iotdev.htlwy.ac.at",{eventid:"asdf", query:{a:12,b:323}, data:"asdfadfqwer"}
      };

      scriptoptions.functions.writeDB=function(context, args)
      {
        if (args.length==2)
        {
          dbThingDbVars.upsert(
            {thing: thingname,
            varname: args[0](),
            value: JSON.stringify(args[1]())
            }).then(test=>{
            });
        }
      };

      scriptoptions.functions.ramVar=function(context, args)
      {
        if (args.length==1 || args.length==2)
        {
          if (!newthing.ramvars.hasOwnProperty(args[0]()))
          {
            var defaultvalue=0;
            if (args.length==2 && typeof(args[1])==="function") defaultvalue=args[1]();
            newthing.ramvars[args[0]()]=defaultvalue;
          }
        }
        var obj={
          get value()
          {
            if (args.length==1 || args.length==2)
            {
              return newthing.ramvars[args[0]()];
            }
            else
            {
              return 0;
            }
          },
          set value(val)
          {
            if (args.length==1 || args.length==2)
            {
              newthing.ramvars[args[0]()]=val;
            }
          }
        };
        return obj;
      };

      scriptoptions.functions.thingVar=function(context, args)
      {
        var obj={
          get value()
          {
            var inputvariables={
              thing: args[0](),
              method: "thing",
              from: thingname,
              varname: args[1]()
            };
            if (args[2] && (typeof args[2]=="function")) {
              var keytoken=keytoken=args[2]();
              if (keytoken.indexOf(":")==(keytoken.length-1))
              {
                keytoken=keytoken.substr(0,keytoken.length-1)
              }
              if (keytoken.indexOf(":")<0)
              {
                var keyobj=keys[keytoken];
                var keyname=keytoken;
                keytoken="";
                if (keyobj)
                {
                  for(var id in newthing.owners)
                  {
                    var owner=newthing.owners[id];
                    if (keyobj.owners.indexOf(owner)>=0)
                    {
                      keytoken=keyname+":"+keyobj.token;
                      break;
                    }
                  }
                }
              }
              if (keytoken.length>0)
              {
                inputvariables.keytoken=keytoken;
              }
            }
            var obj=callThing(inputvariables);
            var json=JSON.stringify(obj);
  /*
            try{
              JSON.parse(json);
            }
            catch(e)
            {
              console.log("================================");
              console.log(inputvariables);
              console.log(obj);
              console.log(json);
              console.log("================================");
            }
  */
            var result=JSON.parse(json);
            return result;
          },
          set value(val)
          {
            var inputvariables={
              thing: args[0](),
              method: "thing",
              from: thingname,
              varname: args[1]()
            };
            inputvariables.value=JSON.parse(JSON.stringify(val));
            if (args[2] && (typeof args[2]=="function")) {
              var keytoken=keytoken=args[2]();
              if (keytoken.indexOf(":")==(keytoken.length-1))
              {
                keytoken=keytoken.substr(0,keytoken.length-1)
              }
              if (keytoken.indexOf(":")<0)
              {
                var keyobj=keys[keytoken];
                var keyname=keytoken;
                keytoken="";
                if (keyobj)
                {
                  for(var id in newthing.owners)
                  {
                    var owner=newthing.owners[id];
                    if (keyobj.owners.indexOf(owner)>=0)
                    {
                      keytoken=keyname+":"+keyobj.token;
                      break;
                    }
                  }
                }
              }
              if (keytoken.length>0)
              {
                inputvariables.keytoken=keytoken;
              }
            }
            var result=callThing(inputvariables);
          }
        };
        return obj;
      };

      scriptoptions.functions.callThingWithKey=function(context, args)
      {
        var result="";
        if (args.length>=3 && (typeof args[0]=="function") && (typeof args[1]=="function") && (typeof args[2]=="function"))
        {
          var inputvariables={
            thing: args[0](),
            method: "thing",
            from: thingname,
            varname: args[1]()
          };
          var keytoken=keytoken=args[2]();
          if (keytoken.indexOf(":")==(keytoken.length-1))
          {
            keytoken=keytoken.substr(0,keytoken.length-1)
          }
          if (keytoken.indexOf(":")<0)
          {
            var keyobj=keys[keytoken];
            var keyname=keytoken;
            keytoken="";
            if (keyobj)
            {
              for(var id in newthing.owners)
              {
                var owner=newthing.owners[id];
                if (keyobj.owners.indexOf(owner)>=0)
                {
                  keytoken=keyname+":"+keyobj.token;
                  break;
                }
              }
            }
          }
          if (keytoken.length>0)
          {
            inputvariables.keytoken=keytoken;
          }
          if (args.length==4 && (typeof args[3]=="function"))
          {
            inputvariables.value=JSON.parse(JSON.stringify(args[3]()));
          }
          result=JSON.parse(JSON.stringify(callThing(inputvariables)));
        }
        return result;
      };

      scriptoptions.functions.callThing=function(context, args)
      {
        var result="";
        if (args.length>=2 && (typeof args[0]=="function") && (typeof args[1]=="function"))
        {
          var inputvariables={
            thing: args[0](),
            method: "thing",
            from: thingname,
            varname: args[1]()
          };
          if (args.length==3 && (typeof args[2]=="function"))
          {
            inputvariables.value=JSON.parse(JSON.stringify(args[2]()));
          }
          result=JSON.parse(JSON.stringify(callThing(inputvariables)));
        }
        return result;
      };

      scriptoptions.functions.webPush=function(context,args)
      {
        if (args.length==2)
        {
          var topic="/"+thingname+"/"+args[0]();
          var arg1=args[1]();
          var notification;
          if (typeof arg1==="string")
          {
            notification={title: "IoT-Broker "+thingname, message: arg1};
          }
          else if (typeof arg1==="object")
          {
            notification=arg1;
          }
          if (typeof notification!="undefined")
          {
            for(var endpoint in subscriptions)
            {
              let subscription=subscriptions[endpoint];
              if (subscription.enabled===true)
              {
                if (subscription.topics.indexOf(topic)>=0)
                {
                  sendPushNotification(subscription.subscription, notification);
                }  
              }
            }
          }
        }
        return true;
      };

      newthing.scriptfunction=thingscriptcompiler.compile(newthing.source,scriptoptions);
      newthing.profiling={scriptruntime:0,initunixtime: Date.now(), load:0};
      if (things[thingname] && things[thingname].timeoutID)
      {
        clearTimeout(things[thingname].timeoutID);
      }


      if (typeof newthing.scriptfunction === "function")
      {
        things[thingname]=newthing;

        var db={};
        dbThingDbVars.findAll({where:{thing: thingname}}).then(list=>{
          for(var i=0;i<list.length;i++)
          {
            db[list[i].varname]=JSON.parse(list[i].value);
          }
          // init is called async
          callThing({
            thing: thingname,
            method: "init",
            db: db
          });
        }).catch(function(error){
        });

      }
      else if (typeof newthing.scriptfunction === "string")
      {
        return newthing.scriptfunction;
      }
      else {
        return false;
      }


      if (opt.loadFromDB===false)
      {
        try {
        // write key to database
          dbThings.upsert(
          {thing: thing.thing,
          source: newthing.source,
          enabled: newthing.enabled,
          owners: JSON.stringify(newthing.owners),
          tags: JSON.stringify(newthing.tags),
          description: newthing.description
          }).then(test=>{
            if (test===true)
            {
              opt.onfinished(newthing);
            }
            else
            {
              opt.onerror(10);
            }
          });
        }
        catch(err)
        {
          opt.onerror(11);
          return "Database issue!";
        }
        return true;
      }
      else
      {
        // thing loaded from database into things object
        opt.onfinished(newthing);
      }

      return true;
    }
    options.onerror(20);
    return false;
  }


  var isUserThingOwner=function(user,thing)
  {
    return (things[thing] && things[thing].owners && things[thing].owners.indexOf(user)>=0)
  }

  var getThingData=function(user,thing)
  {
    var res=null;
    if (isUserThingOwner(user,thing))
    {
      res={};
      res.type="thing";
      res.thing=thing;
      res.enabled=things[thing].enabled;
      res.source=things[thing].source;
      res.owners=things[thing].owners;
      res.tags=things[thing].tags;
      res.description=things[thing].description;
      res.errorlog=things[thing].errorlog || "no error";
      res.profiling=things[thing].profiling;
    }
    return res;
  }


  var setVar=function(user, item, options)
  {
    var res=false;  
    if (isUserThingOwner(user, item.thing))
    {
      if (item.memtype=="ram")
      {
        if (things.hasOwnProperty(item.thing) && things[item.thing].ramvars.hasOwnProperty(item.varname))
        {
          try
          {
            things[item.thing].ramvars[item.varname]=JSON.parse(item.value);
            res=true;
          }
          catch(e)
          {
            res="Invalid JSON!";
          }
        }  
      }
      else if (item.memtype=="db")
      {
        var value;
        try
        {
          value=JSON.parse(item.value);
          res=true;
        }
        catch(e)
        {
          res="Invalid JSON!";
        }
        if (res===true)
        {
          dbThingDbVars.upsert(
            {thing: item.thing,
            varname: item.varname,
            value: JSON.stringify(value)
            }).then(test=>{
            });  
        }
      }
    }
    return res;
  };

  var callThing=function(options)
  {
    if (things[options.thing] && (things[options.thing].enabled==true))
    {
      var context={scriptvars:{}, request:{}};
      context.scriptvars.method=options.method;
      context.scriptvars.action=options.method;
      if (options.hasOwnProperty('from')) context.scriptvars.from=options.from;
      if (options.hasOwnProperty('varname')) {
        context.scriptvars.varname=options.varname;
        context.scriptvars.name=options.varname;
      }
      if (options.hasOwnProperty('value')) context.scriptvars.value=options.value;
      if (options.hasOwnProperty('valueraw')) context.scriptvars.valueraw=options.valueraw;
      if (options.hasOwnProperty('sessionuser')) context.scriptvars.sessionuser=options.sessionuser;

      if (options.hasOwnProperty('keytoken')) context.request.keytoken=options.keytoken;
      if (options.hasOwnProperty('clientipaddr')) context.scriptvars.clientipaddr=options.clientipaddr;
      if (options.hasOwnProperty('db')) context.scriptvars.db=options.db;

      context.scriptvars.res="done";
      context.scriptvars.thingname=options.thing;
      context.scriptvars.events=things[options.thing].events;
      var unixstart=Date.now();
      context.scriptvars.unixtime=unixstart;
      try {
        if (context.scriptvars.action=="http") statistics.totalcalls.http++;
        if (context.scriptvars.action=="thing") statistics.totalcalls.thing++;
        if (context.scriptvars.action=="tick") statistics.totalcalls.tick++;
        if (context.scriptvars.action=="init") statistics.totalcalls.init++;

        // yea, call the thing script now !!!!

        context=things[options.thing].scriptfunction(context);
        things[options.thing].events=[];

        var unixstop=Date.now();
        things[options.thing].profiling.scriptruntime+=unixstop-unixstart;
        things[options.thing].profiling.load=100.0*things[options.thing].profiling.scriptruntime/(unixstop-things[options.thing].profiling.initunixtime);
        if (options.method==="init" || options.method==="tick")
        {
          if (context.scriptvars.timeout && context.scriptvars.timeout>0.095)
          {
            things[options.thing].timeoutID=setTimeout(function(){
              callThing({
                thing: options.thing,
                method: "tick"
              });
            },context.scriptvars.timeout*1000);
          }
        }
        if (context.scriptvars.hasOwnProperty('result')) return context.scriptvars.result;
        return context.scriptvars.res;
      }
      catch(e)
      {
  /*
        console.log(e);
        console.log(context.scriptvars);
  */
        things[options.thing].errorlog={msg:e.message};
        return "Thing Error: A script error occured!";
      }
    }
    return null;
  }

  app.use(session({
      secret: '35FE-98sXq-W87Fxiop9',
      resave: true,
      saveUninitialized: true
  }));

  app.use(express.static(path.join(__dirname,'web')));

  // Authentication and Authorization Middleware
  var authenticateUser = function(req, res, next)
  {
    if (req.session && checkUserLogin(req.session.user, req.session.password))
    {
      return next();
    }
    else
      return res.sendStatus(401);
  };

  // push notifications
  app.get("/publicsettings", (req, res) => {
    var obj={webpushpublickey:publicVapidKey};
  //  console.log(obj);
    res.set({ 'content-type': 'application/json;charset=utf-8' });
    res.send(JSON.stringify(obj));
  });

  // push notifications
  app.get("/subscription", (req, res) => {
    if (!req.query.endpoint) {
      res.send('missing endpoint');
    } else {
      var endpoint=JSON.parse(req.query.endpoint);
      if (subscriptions.hasOwnProperty(endpoint))
      {
        res.status(200).send(JSON.stringify(subscriptions[endpoint]));
      }
      else
      {
        return res.sendStatus(401);
      }
    }
  });

  app.post("/subscription", (req, res) => {
    var body="";
    req.on('data', chunk=>{
      body+=chunk.toString();
    });
    req.on('end',()=>{
      var error="";
      try {
        const data = JSON.parse(body);
        if (data.hasOwnProperty("subscription") && data.hasOwnProperty("topics") && data.hasOwnProperty("enabled"))
        {
          var sub={
            subscription: data.subscription,
            topics: data.topics,
            enabled: data.enabled,
            lastokunixtime: Date.now(),
            trycounter: 0
          };
          var dbdata={
            endpoint: data.subscription.endpoint,
            data: JSON.stringify(sub)
          };
          try {
            dbSubscriptions.upsert(dbdata).then(test=>{
              subscriptions[data.subscription.endpoint]=sub;
              res.status(200).send(JSON.stringify("Subscribed or subscription updated"));
            });
          }
          catch(err)
          {
            res.status(400).send(JSON.stringify("Database Error"));
          }
        }
        else
        {
          res.status(400).send(JSON.stringify("API-Error: Invalid JSON"));
        }
      }
      catch(e)
      {
        res.status(400).send(JSON.stringify("API-Error: Invalid JSON format for value query parameter"));
      }
    });
  });

  // Login endpoint
  app.get('/login', function (req, res) {
    if (!req.query.user || !req.query.password) {
      res.send('login failed');
    } else if(checkUserLogin(req.query.user, req.query.password)) {
      req.session.user = req.query.user;
      req.session.password = req.query.password;
      res.redirect(req.query.redirect || "/");
    } else {
      if (req.query.redirect)
      {
        res.redirect(req.query.redirect);
      }
      else res.send('login failed');
    }
  });

  app.get('/logout', function (req, res) {
    req.session.destroy();
    //res.send("logout success!");
    res.redirect("/");
  });

  // Get content endpoint
  app.get('/dashboard', authenticateUser, function (req, res) {
      res.send("You can only see this after you've logged in.");
  });

  app.get('/', function (req, res) {
    res.redirect("/index.html");
  });

  app.get('/doc/:topic', function (req, res, next) {
    var docname=path.join("doc/",req.params.topic+".md");
    var filename = path.join(__dirname, docname);
    fs.readFile(filename, "binary", function(err, file) {
      if(err)
      {
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.write("Topic not found!\n");
        res.end();
      }
      else
      {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(file, "binary");
        res.end();
      }
    });
  });

  app.get('/user/:username', authenticateUser, function (req, res, next) {
    if (req.session.user == req.params.username || (users[req.session.user] && users[req.session.user].enabled===true && users[req.session.user].admin===true))
    {
      var userdata=getUserData(req.params.username);
      res.set({ 'content-type': 'application/json;charset=utf-8' });
      res.send(JSON.stringify(userdata));
    }
    else
    {
      return res.sendStatus(401);
    }
  });

  app.get('/query/info', function (req, res, next) {
    res.set({ 'content-type': 'application/json;charset=utf-8' });
    var data={brokerversion:packagejson.version,
              thingcount: Object.keys(things).length,
              usercount: Object.keys(users).length,
              keycount: Object.keys(keys).length,
              websitecount: Object.keys(websites).length,
              statistics:statistics,
              systemadministrator: brokersettings.systemadministrator
            };
    res.send(JSON.stringify(data));
  });

  app.get('/query/userdata', authenticateUser, function (req, res, next) {
    if ((users[req.session.user] && users[req.session.user].enabled===true))
    {
      var userdata=getUserData(req.session.user);
      res.set({ 'content-type': 'application/json;charset=utf-8' });
      res.send(JSON.stringify(userdata));
    }
    else
    {
      return res.sendStatus(401);
    }
    // security issue
  /*
    var userdata=getUserData(req.session.user);
    res.set({ 'content-type': 'application/json;charset=utf-8' });
    res.send(JSON.stringify(userdata));
  */
  });


  app.get('/query/mythings',authenticateUser, function (req, res, next) {
    var user=req.session.user;
    var list=[];
    for(var thingname in things)
    {
      var thing=getThingData(user, thingname);
      if (thing!=null)
      {
        list.push(thing);
      }
    }
    res.set({ 'content-type': 'application/json;charset=utf-8' });
    res.send(JSON.stringify(list));
  });

  app.get('/query/mykeys',authenticateUser, function (req, res, next) {
    var user=req.session.user;
    var list=[];
    for(var keyname in keys)
    {
      var key=getKeyData(user, keyname);
      if (key!=null)
      {
        list.push(key);
      }
    }
    res.set({ 'content-type': 'application/json;charset=utf-8' });
    res.send(JSON.stringify(list));
  });

  app.get('/query/mywebsites',authenticateUser, function (req, res, next) {
    var user=req.session.user;
    var list=[];
    for(var websitename in websites)
    {
      var website=getWebSiteData(user, websitename);
      if (website!=null)
      {
        list.push(website);
      }
    }
    res.set({ 'content-type': 'application/json;charset=utf-8' });
    res.send(JSON.stringify(list));
  });

  app.get('/query/thing/:thingname/owners', function (req, res, next) {
    if (things.hasOwnProperty(req.params.thingname))
    {
      res.set({ 'content-type': 'application/json;charset=utf-8' });
      res.send(JSON.stringify(things[req.params.thingname].owners));
    }
    else
    {
      return res.sendStatus(401);
    }
  });

  app.get('/query/thing/:thingname/ram', authenticateUser, function (req, res, next) {
  if (isUserThingOwner(req.session.user, req.params.thingname))
  {
    var vars=[];
    for(var varname in things[req.params.thingname].ramvars)
    {
      var preview=JSON.stringify(things[req.params.thingname].ramvars[varname]);
      var jsonsize=preview.length;
      if (preview.length>50)
      {
        preview=preview.substring(0,40)+"...";
      }
      vars.push({name: varname, jsonsize: jsonsize, jsonpreview: preview});
    }
    res.set({ 'content-type': 'application/json;charset=utf-8' });
    res.send(JSON.stringify(vars));
  }
  else {
    return res.sendStatus(401);
  }
  });

  app.get('/query/thing/:thingname/ram/:varname', authenticateUser, function (req, res, next) {
    if (isUserThingOwner(req.session.user, req.params.thingname))
    {
      if (things[req.params.thingname].ramvars.hasOwnProperty(req.params.varname))
      {
        res.set({ 'content-type': 'application/json;charset=utf-8' });
        res.send(JSON.stringify(things[req.params.thingname].ramvars[req.params.varname]));
      }
      else
      {
        return res.sendStatus(404);
      }
    }
    else
    {
    return res.sendStatus(401);
    }
  });



  app.get('/delete/thing/:thingname/ram/:varname', authenticateUser, function (req, res, next) {
    if (isUserThingOwner(req.session.user, req.params.thingname))
    {
      var vars=[];
      if (things[req.params.thingname].ramvars.hasOwnProperty(req.params.varname))
      {
        delete things[req.params.thingname].ramvars[req.params.varname];
      }
      else
      {
        res.status(400).send("ERROR ramVar "+req.params.thingname+"/"+req.params.varname+" does not exists.");
      }
    }
    else
    {
    return res.sendStatus(401);
    }
  });

  app.get('/query/thing/:thingname/db', authenticateUser, function (req, res, next) {
  if (isUserThingOwner(req.session.user, req.params.thingname))
  {
    var vars=[];
    dbThingDbVars.findAll({where:{thing: req.params.thingname}}).then(list=>{
      for(var i=0;i<list.length;i++)
      {
        var preview=JSON.stringify(list[i].value);
        var jsonsize=preview.length;
        if (preview.length>50)
        {
          preview=preview.substring(0,40)+"...";
        }
        vars.push({name: list[i].varname, jsonsize: jsonsize, jsonpreview: preview});
      }
      res.set({ 'content-type': 'application/json;charset=utf-8' });
      res.send(JSON.stringify(vars));
    }).catch(function(error){
      return res.sendStatus(500);
    });
  }
  else {
    return res.sendStatus(401);
  }
  });

  app.get('/query/thing/:thingname/db/:varname', authenticateUser, function (req, res, next) {
    if (isUserThingOwner(req.session.user, req.params.thingname))
    {
      var vars=[];
      dbThingDbVars.findAll({where:{thing: req.params.thingname, varname: req.params.varname}}).then(list=>{
        if (list.length == 1)
        {
          res.set({ 'content-type': 'application/json;charset=utf-8' });
          res.send(list[0].value); // value is JSON
        }
        else
        {
          return res.sendStatus(404);
        }
      }).catch(function(error){
        return res.sendStatus(500);
      });
    }
    else
    {
    return res.sendStatus(401);
    }
  });

  app.get('/delete/thing/:thingname/db/:varname', authenticateUser, function (req, res, next) {
    if (isUserThingOwner(req.session.user, req.params.thingname))
    {
      var vars=[];
      dbThingDbVars.destroy({where:{thing: req.params.thingname, varname: req.params.varname}}).then(function(response){
        res.status(201).send("dbVar "+req.params.thingname+"/"+req.params.varname+" deleted!");
      }).catch(function(error){
        res.status(400).send("ERROR Database issue during deleting dbVar "+req.params.thingname+"/"+req.params.varname+"");
      });
    }
    else
    {
    return res.sendStatus(401);
    }
  });

  app.get('/thing/:thingname', authenticateUser, function (req, res, next) {
    var thingdata=getThingData(req.session.user, req.params.thingname);
    if (thingdata==null) return res.sendStatus(401);
    res.set({ 'content-type': 'application/json;charset=utf-8' });
    res.send(JSON.stringify(thingdata));
  });

  app.get('/key/:keyname', authenticateUser, function (req, res, next) {
    var keydata=getKeyData(req.session.user, req.params.keyname);
    if (keydata==null) return res.sendStatus(401);
    res.set({ 'content-type': 'application/json;charset=utf-8' });
    res.send(JSON.stringify(keydata));
  });

  app.get('/s/:shortlink', function(req,res,next){

    var inputvariables={
      thing: "brokersettings",
      method: "broker",
      from: "",
      varname: "shortlink"
    };
    inputvariables.value=req.params.shortlink;
    var url=callThing(inputvariables);
    if (typeof url==="string")
    {
      res.redirect(url);
    }
    else
    {
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.write("!!! Link "+req.params.shortlink+" not found !!!\n");
      res.end(); 
    }
  });

  app.get('/website/:websitename/*',  function (req, res, next) {
    var websitedata=websites[req.params.websitename];
    if ( websitedata==null || websitedata.enabled==false ) return res.sendStatus(404);
    var filepath=req.params[0];
    if (filepath==="")
    {
      res.redirect("./index.html");
      return;
    }

    dbWebSiteFiles.findAll({where:{website: req.params.websitename, filepath: filepath}}).then(list=>{
      if (list.length==1)
      {
        res.writeHead(200, {'Content-Type': mime.lookup(filepath)});
        res.write(list[0].content, "binary");
        res.end();
      }
      else
      {
        res.writeHead(500, {"Content-Type": "text/plain"});
        res.write("!!! File "+path+" not found !!!!\n");
        res.end();
      }
    }).catch(function(error){
      res.writeHead(500, {"Content-Type": "text/plain"});
      res.write("!!! File "+path+" not found !!!\n");
      res.end();
    });
  });


  app.get('/query/website/:websitename', authenticateUser, function (req, res, next) {
    var websitedata=getWebSiteData(req.session.user, req.params.websitename);
    if (websitedata==null) return res.sendStatus(401);
    res.set({ 'content-type': 'application/json;charset=utf-8' });
    res.send(JSON.stringify(websitedata));
  });

  app.get('/query/website/:websitename/files*',  authenticateUser, function (req, res, next) {
    getWebSiteItem(req.session.user, req.params.websitename,req.params[0],
    function(item){
      if (item==null) res.sendStatus(401);
      else {
        res.set({ 'content-type': 'application/json;charset=utf-8' });
        res.send(JSON.stringify(item));
      }
    },
    function(){
      res.sendStatus(406);
    });
  });

  app.post('/upload/website/:websitename', authenticateUser, function (req, res, next) {
    var websitename=req.params.websitename;
    var user=req.session.user;
    if (websites[websitename].owners.indexOf(user)<0)
    {
      res.status(401).send("ERROR /website/"+websitename+" access not allowed!\n");
    }
    uploadService(req,res,function(err){
      if (err)
      {
        res.status(406).send("ERROR File not uploaded (file limit "+zipfilelimit_mb+"MB).");
      }
      else
      {
        let buffer=req.file.buffer;
        let zip = new AdmZip(buffer);
        let zipEntries = zip.getEntries();
        var bulk=[];
        var totalsum=0;
        zipEntries.forEach(function(zipEntry) {
          var data={
            website: websitename,
            filepath: zipEntry.entryName,
            content: ""
          };
          if (zipEntry.entryName.endsWith("/")==false) {
            data.content=zipEntry.getData();
            totalsum+=data.content.length;
            if (totalsum>websitelimit_mb*1000*1000)
            {
            }
            else
            {
              bulk.push(data);
            }
          } else {
            data.content="";
            bulk.push(data);
          }
        });
        if (totalsum>websitelimit_mb*1000*1000)
        {
          res.status(406).send("ERROR Website not inserted (total website limit "+websitelimit_mb+"MB).");
          return;
        }
        else
        {
          dbWebSiteFiles.destroy({where:{website: websitename}}).then(function(response){
            dbWebSiteFiles.bulkCreate(bulk).then(function(response){
              res.status(201).send("Website "+websitename+" upload finished! "+response.length+" files inserted.");
            });
          }).catch(function(error){
            res.status(400).send("ERROR Database issue during uploading "+websitename+". (1)");
          });
        }
      }
    });
  });

  app.get('/thing/:thingname/:varname', function (req, res, next) {
    var inputdata={
      thing: req.params.thingname,
      method: "http",
      varname: req.params.varname
    };
    var error="";
    if (req.query.hasOwnProperty("value")) {
      inputdata.valueraw=req.query.value;
      try {
        inputdata.value=JSON.parse(req.query.value);
      }
      catch(e)
      {
        //error="API-Error: Invalid JSON format for value query parameter"
      }
    }
    if (req.query.hasOwnProperty("keytoken")) inputdata.keytoken=req.query.keytoken;
    if (req.session && checkUserLogin(req.session.user, req.session.password))
    {
      inputdata.sessionuser=req.session.user;
    }
    inputdata.clientipaddr=req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    var result="";
    if (error=="")
    {
      result=callThing(inputdata);
      res.header("Content-Type", "application/json");
      res.header("Access-Control-Allow-Origin","*");
      res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
      res.status(200).send(JSON.stringify(result));
    }
    else
    {
      result=error;
      res.header("Content-Type", "application/json");
      res.header("Access-Control-Allow-Origin","*");
      res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
      res.status(400).send(JSON.stringify(result));
    }
  });

  app.post('/thing/:thingname/:varname', function (req, res, next) {
    var body="";
    var inputdata={
      thing: req.params.thingname,
      method: "http",
      varname: req.params.varname
    };
    req.on('data', chunk=>{
      body+=chunk.toString();
    });
    req.on('end',()=>{
      var error="";
      inputdata.valueraw=body;
      try {
        inputdata.value=JSON.parse(body);
      }
      catch(e)
      {
        //error="API-Error: Invalid JSON format for value query parameter"
      }
      if (req.query.hasOwnProperty("keytoken")) inputdata.keytoken=req.query.keytoken;
      if (req.session && checkUserLogin(req.session.user, req.session.password))
      {
        inputdata.sessionuser=req.session.user;
      }
      inputdata.clientipaddr=req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      var result="";
      if (error=="")
      {
        result=callThing(inputdata);
        res.header("Content-Type", "application/json");
        res.header("Access-Control-Allow-Origin","*");
        res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
        res.status(200).send(JSON.stringify(result));
      }
      else
      {
        result=error;
        res.header("Content-Type", "application/json");
        res.header("Access-Control-Allow-Origin","*");
        res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
        res.status(400).send(JSON.stringify(result));
      }
    });
  });



  app.post('/key', authenticateUser, function (req, res, next) {
    try {
      var keydata=JSON.parse(request.body);
      if (setKeyData(req.session.user,keydata)==true)
      {
        res.sendStatus(201);
        res.send("OK Key "+keydata.key+" updated or added!");
      }
      else
      {
        res.send("ERROR Key "+keydata.key+" access not allowed!");
        res.sendStatus(401);
      }
    } catch (e) {
      res.send("ERROR Key "+keydata.key+" has wrong Value!");
      res.sendStatus(400); // Bad request
    }
  });

  app.post('/batchupload', authenticateUser, function (req, res, next) {


    var bodyStr = '';
    req.on("data",function(chunk){
        bodyStr += chunk.toString();
    });
    req.on("end",function(){
      var msg="";
      var statuscode=201;
      try {
        var batch=JSON.parse(bodyStr);
        for(var i=0;i<batch.length;i++)
        {
          data=batch[i];
          if (data.type)
          {
            var result="unknown type";

            if (data.type=="key") result=setKeyData(req.session.user,data);
            if (data.type=="thing") result=setThingData(req.session.user,data);
            if (data.type=="user") result=setUserData(req.session.user,data);
            if (data.type=="website") result=setWebSiteData(req.session.user,data);
            if (data.type=="websitefile") result=setWebSiteItem(req.session.user,data);
            if (data.type=="websitedirectory") result=setWebSiteItem(req.session.user,data);
            if (data.type=="var") result=setVar(req.session.user,data);

            if (result===true)
            {
              msg+="OK /"+data.type+"/"+data[data.type]+" updated or added!\n";
            }
            else if (result===false)
            {
              msg+="ERROR /"+data.type+"/"+data[data.type]+" access not allowed!\n";
              statuscode=401;
            }
            else if (typeof result=="string")
            {
              msg+="ERROR /"+data.type+"/"+data[data.type]+" "+result+"\n";
              statuscode=406; // not accaptable
            }
          }
        }
      } catch (e) {
        msg+="ERROR Parsing error\n";
        statuscode=400; // Bad request
      }
      res.status(statuscode).send(msg);
    });
  });

  var obj={};
  obj.run=function(){
    return new Promise((resolve, reject)=>{
      sequelize.sync().then(()=>{
        loadSubscriptionsFromDB(function(){
          loadUsersFromDB(function(){
            loadKeysFromDB(function(){
              loadThingsFromDB(function(){
                loadWebSitesFromDB(function(){
                  //dumpUsers2Files();
                  console.log("Database loaded!");
                  app.listen(brokersettings.port);
                  resolve("SUCCESS");
                });
              });
            });
          });
        });
      }).catch(()=>{
        reject("FAILURE");
      });
    });
  };

  obj.stop=function(){
    return sequelize.connectionManager.close();
  }
  
  obj.config=brokersettings;
  obj.express=app;

  return obj;
};

module.exports = iotb;

/*


console.log("IoT Broker listening on port "+brokersettings.port);

let events = [
  {name: 'beforeExit', exitCode: 0 },
  {name: 'uncaughtExecption', exitCode: 1 },
  {name: 'SIGINT', exitCode: 130 },
  {name: 'SIGTERM', exitCode: 143 }
];

events.forEach((e) => {
  process.on(e.name,  () => {
    sequelize.connectionManager.close()
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
*/