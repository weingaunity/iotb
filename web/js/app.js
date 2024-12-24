// *********************************************************************
// IoTB - IoT-Broker Web-Interface
// Copyright (C) 2018-2024  DI Weichinger Klaus, MSc, snaky.1@gmx.at
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

var app;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function utf8_encode(s) {
    return unescape(encodeURIComponent(s));
}

function sha1(str)
{
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
/*
var loadServiceWorker=function(callback){
  navigator.serviceWorker.register("./service-worker.js", { //Await: Pausiert async function, bis Promise erfüllt ist
    scope: "./" //Reichweite des Service-Workers
  }).then(function(reg){
    locals.register=reg;
    var publicVapidKey='BNJazlUtYmqpMjzm30dBN6SXE1JSbd0_QCs_OoB-hdWtKGQl78_J9qK8zFnloLBZn7PAwnv_6lW4r9SDOuFrY1s';
    locals.register.pushManager.getSubscription().then(function(subscription){
      if (!subscription)
      {
        locals.register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        }).then(function(subscription){
          console.log("Registered:");
          console.log(subscription);
          locals.subscription=subscription;
        });
      }
      else
      {
        console.log("Existing:");
        console.log(subscription);
        locals.subscription=subscription;
      }
    });
  }).catch(function(){
    callback();
  });
};
*/
var wgServiceWorker=function(){
  var obj={};
  var local={};

  obj.setPublicVapidKey=function(key)
  {
    local.publicVapidKey=key;
  };

  obj.load=function(callback){
    if (local.hasOwnProperty("register"))
    {
      callback(local.register);
    }
    else
    {
      navigator.serviceWorker.register("./service-worker.js", { //Await: Pausiert async function, bis Promise erfüllt ist
        scope: "./" //Reichweite des Service-Workers
      }).then(function(reg){
        local.register=reg;
        callback(reg);
      }).catch(function(){
        callback();
      });
    }
  };

  obj.unregister=function()
  {
    obj.load(function(reg){
      reg.unregister().then(function(boolean){

      });
    });
  }

  obj.getSubscription=function(callback){
    obj.load(function(reg){
      if (reg)
      {
        if (local.hasOwnProperty("subscription"))
        {
          callback(local.subscription);
        }
        else
        { 
          reg.pushManager.getSubscription().then(function(subscription){
            if (!subscription)
            {
              if (typeof local.publicVapidKey==="string")
              {
                reg.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(local.publicVapidKey)
                  //applicationServerKey: local.publicVapidKey
                }).then(function(subscription){
                  local.subscription=subscription;
                  callback(subscription);
                }).catch(function(e){
                  console.log(e);
                  callback();
                });
              }
              else
              {
                fetch("/publicsettings")
                .then(function (response) {
                  return response.json();
                }).then(function (json) {
                  local.publicVapidKey=json.webpushpublickey;
                  reg.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(local.publicVapidKey)
                    //applicationServerKey: local.publicVapidKey
                  }).then(function(subscription){
                    local.subscription=subscription;
                    callback(subscription);
                  }).catch(function(e){
                    console.log(e);
                    callback();
                  });
                }).catch(function(e){
                  console.log(e);
                  callback();
                });
              }
            }
            else
            {
              local.subscription=subscription;
              callback(subscription);
            }
          }).catch(function(e){
            console.log(e);
            callback();
          });
        }
      }
      else callback();
    });
  };
  return obj;
}

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      //paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }
  return obj;
}

window.onload = function() {
  var sw=wgServiceWorker();



  const VueAceEditor = {
      //  simplified model handling using `value` prop and `input` event for $emit
      model: {
        prop: 'value',
        event: 'input'
      },
      props:['value','id','options'],

      //  add dynmic class and id (if not set) based on component tag
      template:`
          <div :id="id ? id: $options._componentTag +'-'+ _uid"
               :class="$options._componentTag">
              <slot></slot>
          </div>
      `,

      watch:{
          value() {
              //  two way binding – emit changes to parent
              //  update value on external model changes
              if(this.oldValue !== this.value)
              {
                  this.editor.setValue(this.value, 1);
              }
          }
      },

      mounted(){
          //  editor
          this.editor = window.ace.edit(this.$el.id);

          //  deprecation fix
          this.editor.$blockScrolling = Infinity;

          //  ignore doctype warnings
          const session = this.editor.getSession();
          session.on("changeAnnotation", () => {
              const a = session.getAnnotations();
              const b = a.slice(0).filter( (item) => item.text.indexOf('DOC') == -1 );
              if(a.length > b.length) session.setAnnotations(b);
          });

          //  editor options
          //  https://github.com/ajaxorg/ace/wiki/Configuring-Ace
          this.options = this.options || {};

          //  opinionated option defaults
          this.options.maxLines = this.options.maxLines || Infinity;
          this.options.printMargin = this.options.printMargin || false;
          this.options.highlightActiveLine = this.options.highlightActiveLine || false;
          this.options.useSoftTabs = true;
          this.options.tabSize = 2;
          //  hide cursor
          if(this.options.cursor === 'none' || this.options.cursor === false){
              this.editor.renderer.$cursorLayer.element.style.display = 'none';
              delete this.options.cursor;
          }

          //  add missing mode and theme paths
          if(this.options.mode && this.options.mode.indexOf('ace/mode/')===-1) {
              this.options.mode = `ace/mode/${this.options.mode}`;
          }
          if(this.options.theme && this.options.theme.indexOf('ace/theme/')===-1) {
              this.options.theme = `ace/theme/${this.options.theme}`;
          }
          this.editor.setOptions(this.options);


          //  set model value
          //  if no model value found – use slot content
          if(!this.value || this.value === ''){
              this.$emit('input', this.editor.getValue());
          } else {
              this.editor.setValue(this.value, -1);
          }

          //  editor value changes
          var v=this;
          this.editor.on('change', () => {
              //  oldValue set to prevent internal updates
               v.value = v.oldValue = v.editor.getValue();
               this.$emit('input', this.value);
               console.log("change");
              });

          this.editor.commands.addCommand({
            name: "save",
            bindKey: {win: "Ctrl-S", mac: 'Command-S'},
            exec:function(){v.$emit('ctrl-s');}
          });
          this.editor.commands.addCommand({
            name: "save-all",
            bindKey: {win: "Ctrl-Shift-S", mac: 'Command-Shift-S'},
            exec:function(){v.$emit('ctrl-shift-s');}
          });
          this.editor.commands.addCommand({
            name: "run",
            bindKey: {win: "Ctrl-R", mac: 'Command-R'},
            exec:function(){v.$emit('ctrl-r');}
          });


      },
      methods:{ editor(){ return this.editor } }
  };

  var mdHtml;

  app=new Vue({
    el: '#q-app',
    components:{
        'vue-ace-editor': VueAceEditor
  //      'vue-markdown': VueMarkdown
    },
    data: {
      exsampleoptions:{
              mode:'javascript',
              theme: 'tomorrow',
              fontSize: 13,
              fontFamily: 'monospace',
              highlightActiveLine: false,
              highlightGutterLine: false
            },
      jsonoptions:{
        mode:'json',
        theme: 'tomorrow',
        fontSize: 13,
        fontFamily: 'monospace',
        highlightActiveLine: false,
        highlightGutterLine: false
      },
      vueoptions:{html: {
              mode:'html',
              theme: 'tomorrow',
              fontSize: 13,
              fontFamily: 'monospace',
              highlightActiveLine: false,
              highlightGutterLine: false
            },
            css: {
                    mode:'css',
                    theme: 'tomorrow',
                    fontSize: 13,
                    fontFamily: 'monospace',
                    highlightActiveLine: false,
                    highlightGutterLine: false
                  },
            js: {
                    mode:'javascript',
                    theme: 'tomorrow',
                    fontSize: 13,
                    fontFamily: 'monospace',
                    highlightActiveLine: false,
                    highlightGutterLine: false
                  }
                  
      },
      helpfiles:["about","firststeps","readme","scripting","scripting-examples","changelog"],
      commands:[
        {label:"Favorites", command:"favorites"},
        {label:"My notifications", command:"notifications"},
        {label:"Info", command:"info"}
      ],
      searchinput:"",
      logindata:
      {
        user: "",
        pwd: ""
      },
      info:{brokerversion:""},
      drawer: false,
      connected: false,
      user: null,
      //username: null,
      tabs:[]
    },
    methods: {

      generateUUID: function() { // Public Domain/MIT
          var d = new Date().getTime();
          if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
              d += performance.now(); //use high-precision timer if available
          }
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
              var r = (d + Math.random() * 16) % 16 | 0;
              d = Math.floor(d / 16);
              return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
          });
      },

      changeUserPassword: function(tab)
      {
        var vuedata=this;
        var obj={type:"user",
                      user:tab.user,
                      oldpassword: pwdsalt(tab.oldpassword),
                      newpassword1: pwdsalt(tab.newpassword1),
                      newpassword2: pwdsalt(tab.newpassword2)};
        this.save(obj,0,{
          success: function(thingdata)
          {
            vuedata.$q.notify({
              color: 'secondary',
              icon: 'thumb_up',
              message: 'Password modified!',
              timeout: 1000
            });
            tab.oldpassword="";
            tab.newpassword1="";
            tab.newpassword2="";
            window.location.reload();
          },
          error:function(request, status, error)
          {
            vuedata.$q.notify({
              color: 'pink',
              icon: 'report_problem',
              message: 'Password not modified!',
              timeout: 3000
            });
          }
        });
      },
      changeUserSettings: function(tab)
      {
        var vuedata=this;
        var obj={type:"user",
                      user:tab.user,
                      email: tab.email,
                      username: tab.username,
                      admin: tab.admin,
                      enabled: tab.enabled};
        this.save(obj,0,{
          success: function(thingdata)
          {
            vuedata.$q.notify({
              color: 'secondary',
              icon: 'thumb_up',
              message: 'User settings modified!',
              timeout: 1000
            });
          },
          error:function(request, status, error)
          {
            vuedata.$q.notify({
              color: 'pink',
              icon: 'report_problem',
              message: 'User settings not modified!',
              timeout: 3000
            });
          }
        });
      },

      fileUploadOK: function(file,xhr)
      {
        var msg=xhr.response;
        this.$q.notify({
          color: 'secondary',
          icon: 'thumb_up',
          message: msg,
          timeout: 1000
        });
      },

      fileUploadError: function(file,xhr)
      {
        var msg=xhr.response;
        this.$q.notify({
          color: 'pink',
          icon: 'report_problem',
          message: msg,
          timeout: 3000
        });
      },

      createnewtoken: function(tab)
      {
        if (tab.type=="key") tab.token=this.generateUUID();
      },

      close: function(tab,index)
      {
        this.tabs.splice(index, 1)
      },

      saveall: function()
      {
        for(var i=0;i<this.tabs.length;i++)
        {
          this.save(this.tabs[i],i);
        }
      },

      save: function(tab,index,options)
      {
        var vuedata=this;
        var obj={};
        var objtype="---";

        obj.type=tab.type;
        obj._saveoptions=tab._saveoptions || {};
        if (obj.type==="notifications")
        {
          // check notification topics
          var valid=true;
          for(var i=0;i<tab.topics.length;i++)
          {
            var symbols="abcdefghijklmnopqrstuvwxyz0123456789-_./";
            var t=tab.topics[i];
            for(j=0;j<t.length;j++)
            {
              if (symbols.indexOf(t[j])<0)
              {
                vuedata.$q.notify({
                  color: 'pink',
                  icon: 'report_problem',
                  message: "Invalid topic name: "+t,
                  timeout: 3000
                });
                valid=false;
                break;
              }
            }
          }
          if (valid)
          {
            sw.getSubscription(function(sub){
              if (sub)
              {
                fetch("/subscription", {
                  method: "POST",
                  body: JSON.stringify({enabled: tab.enabled,topics: tab.topics, subscription:sub}),
                  headers: {
                    "content-type": "application/json"
                  }
                }).then(function(response){
                  return response.json();
                }).then(function(json){
                  vuedata.$q.notify({
                    color: 'secondary',
                    icon: 'thumb_up',
                    message: json,
                    timeout: 1000
                  });
                }).catch(function(){
                  vuedata.$q.notify({
                    color: 'pink',
                    icon: 'report_problem',
                    message: "Subscription issue!",
                    timeout: 3000
                  });
                });
              }
              else
              {
                vuedata.$q.notify({
                  color: 'pink',
                  icon: 'report_problem',
                  message: "Notifications not supported!",
                  timeout: 3000
                });
              }
            });
          }
        }
        if (obj.type==="var")
        {
          obj.thing=tab.thing;
          obj.varname=tab.varname;
          obj.memtype=tab.memtype;
          obj.var=tab.thing+"/"+tab.memtype+"/"+tab.varname;
          objtype="var";
          try{
            obj.value=JSON.stringify(JSON.parse(tab.value));
          }
          catch(e)
          {
            vuedata.$q.notify({
              color: 'pink',
              icon: 'report_problem',
              message: 'Invalid JSON!',
              timeout: 3000
            });
            return;
          }
        }
        if (obj.type==="websitefile")
        {
          obj.websitefile="/"+tab.website+tab.filepath;
          obj.website=tab.website;
          obj.filepath=tab.filepath;
          obj.content=tab.content;
          objtype="Website File";
        }
        if (obj.type==="website")
        {
          obj.website=tab.website;
          obj.owners=tab.owners;
          obj.enabled=tab.enabled;
          obj.tags=tab.tags;
          obj.description=tab.description;
          objtype="Website";
        }
        if (obj.type==="user")
        {
          obj.user=tab.user;
          if (tab.oldpassword && tab.newpassword1 && tab.newpassword2)
          {
            obj.oldpassword=tab.oldpassword;
            obj.newpassword1=tab.newpassword1;
            obj.newpassword2=tab.newpassword2;
          }
          if (tab.email) obj.email=tab.email;
          if (tab.username) obj.username=tab.username;
          if (typeof(tab.enabled) === "boolean") obj.enabled=tab.enabled;
          if (typeof(tab.admin) === "boolean") obj.admin=tab.admin;
          objtype="User";
        }
        if (obj.type==="thing")
        {
          obj.thing=tab.thing;
          obj.source=tab.source;
          obj.owners=tab.owners;
          obj.enabled=tab.enabled;
          obj.tags=tab.tags;
          obj.description=tab.description;
          objtype="Thing";
        }
        if (obj.type==="key")
        {
          obj.key=tab.key;
          obj.token=tab.token;
          obj.owners=tab.owners;
          obj.enabled=tab.enabled;
          obj.tags=tab.tags;
          obj.description=tab.description;
          objtype="Key";
        }
        if (objtype!="---")
        {
          var objname=obj[obj.type];
          var batch=[obj];
          $.ajax({
            type: 'POST',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: '/batchupload',
            // data to be added to query string:
            data: JSON.stringify(batch),
  //          timeout: 700,
            context: $('body'),
            success: function(thingdata)
            {
              if (options && options.success)
              {
                options.success(thingdata);
              }
              else
              {
                if(tab.contentmodified ===true) tab.contentmodified=false;
                vuedata.$q.notify({
                  color: 'secondary',
                  icon: 'thumb_up',
                  message: '/'+objtype+'/'+objname+' saved!',
                  timeout: 1000
                });
              }
            },
            error:function(request, status, error)
            {
              if (options && options.error)
              {
                options.error(request,status,error);
              }
              else
              {
                vuedata.$q.notify({
                  color: 'pink',
                  icon: 'report_problem',
                  message: '/'+objtype+'/'+objname+' not saved!',
                  timeout: 3000
                });
                if (request.status==406)
                {
                  vuedata.$q.notify({
                    color: 'pink',
                    icon: 'report_problem',
                    message: request.responseText,
                    timeout: 5000
                  });
                }
              }
            }
          });
        }
      },
      create: function(obj)
      {
        var vuedata=this;
        this.save(obj,0,{
          success: function(thingdata)
          {
            vuedata.$q.notify({
              color: 'secondary',
              icon: 'thumb_up',
              message: '/'+obj.type+'/'+obj[obj.type]+' created!',
              timeout: 1000
            });
            vuedata.search(obj.type+":"+obj[obj.type]);
          },
          error:function(request, status, error)
          {
            vuedata.$q.notify({
              color: 'pink',
              icon: 'report_problem',
              message: '/'+obj.type+'/'+obj[obj.type]+' not created!',
              timeout: 3000
            });
          }
        });
      },
      createFile: function(website, filepath)
      {
        var obj={};
        obj.type="websitefile";
        obj.websitefile=website+filepath;
        obj.website=website;
        obj.filepath=filepath;
        obj.content="";

        this.create(obj);
      },
      createUser: function(username)
      {
        var obj={};
        obj.type="user";
        obj.user=username;
        obj.enabled=true;
        obj.admin=false;
        obj.email="";
        obj.username="New user";
        obj.oldpassword="";
        obj.newpassword1="";
        obj.newpassword2="";
        this.create(obj);
      },
      createThing: function(thingname)
      {
        var obj={};
        obj.type="thing";
        obj.thing=thingname;
        obj.enabled=true;
        obj.source="/* insert script here */";
        obj.owners=[this.user.user];
        obj.tags=[];
        obj.description="";
        this.create(obj);
      },
      createKey: function(keyname)
      {
        var obj={};
        obj.type="key";
        obj.key=keyname;
        obj.enabled=true;
        obj.token=this.generateUUID();
        obj.owners=[this.user.user];
        obj.tags=[];
        obj.description="";
        this.create(obj);
      },
      createWebSite: function(websitename)
      {
        var obj={};
        obj.type="website";
        obj.website=websitename;
        obj.enabled=true;
        obj.owners=[this.user.user];
        obj.tags=[];
        obj.description="";
        this.create(obj);
      },
      del: function(obj)
      {
        var v=this;
        if (obj.type=="var")
        {
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: '/delete/thing/'+obj.thing+'/'+obj.memtype+'/'+obj.varname,
            context: $('body'),
            success: function(thingdata)
            {
              v.$q.notify({
                color: 'secondary',
                icon: 'thumb_up',
                message: '/thing/'+obj.thing+'/'+obj.memtype+'/'+obj.varname+' deleted!',
                timeout: 1000
              });
            },
            error:function(request, status, error)
            {
              v.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: '/thing/'+obj.thing+'/'+obj.memtype+'/'+obj.varname+' not deleted!',
                timeout: 3000
              });
              if (request.status==406)
              {
                v.$q.notify({
                  color: 'pink',
                  icon: 'report_problem',
                  message: request.responseText,
                  timeout: 5000
                });
              }
            }
          });
        }
      },
      search: function(string,currenttab,_mode)
      {
        var mode="here";
        if (typeof _mode === "string")
        {
          mode=_mode;
        }
        var insertTab=function(item)
        {
          if (currenttab) {
            if (mode==="here")
            {
              var i=vuedata.tabs.indexOf(currenttab);
              Vue.set(vuedata.tabs,i,item);  
            }
            if (mode==="above")
            {
              var i=vuedata.tabs.indexOf(currenttab);
              vuedata.tabs.splice(i,0,item);

            }
          } else {
            vuedata.tabs.unshift(item);
          }
        }
        var searchstring=this.searchinput;
        if (string) searchstring=string;
        if (!string) this.searchinput="";
        var vuedata=this;
        var found=false;
        if (searchstring=="removeserviceworker")
        {
          sw.unregister();
          vuedata.$q.notify({
            color: 'secondary',
            icon: 'thumb_up',
            message: 'Serviceworker removed!',
            timeout: 1000
          });
        }
        if (searchstring=="notifications" || searchstring.startsWith("subscribe:"))
        {
          var newtopics=[];
          if (searchstring.startsWith("subscribe:"))
          {
            console.log(searchstring);
            newtopics=searchstring.substring(10).split(",");
          }
          sw.getSubscription(function(sub){
            if (sub)
            {
              fetch("/subscription?endpoint="+encodeURI(JSON.stringify(sub.endpoint)))
              .then(function (response) {
                return response.json();
              }).then(function (json) {
                var topics=json.topics;
                for(var i=0;i<newtopics.length;i++)
                {
                  var t=newtopics[i];
                  if (topics.indexOf(t)<0) topics.push(t);
                }
                var infodata={type: "notifications", enabled:json.enabled, topics:topics};
                insertTab(infodata);
              }).catch(function(){
                var infodata={type: "notifications", enabled:true, topics:newtopics};
                insertTab(infodata);
              });       
            }
            else
            {
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: 'Notifications not supported!',
                timeout: 3000
              });
            }  
          });
        }
        if (searchstring.startsWith("createwebsite:"))
        {
          var websitename=searchstring.substring(14);
          this.createWebSite(websitename);
        }
        if (searchstring.startsWith("createuser:"))
        {
          var username=searchstring.substring(11);
          this.createUser(username);
        }
        if (searchstring.startsWith("creatething:"))
        {
          var thingname=searchstring.substring(12);
          this.createThing(thingname);
        }
        if (searchstring.startsWith("createkey:"))
        {
          var keyname=searchstring.substring(10);
          this.createKey(keyname);
        }
        if (searchstring==="info")
        {
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: '/query/info',
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(info) {
              var infodata={type: "info", info:info};
              insertTab(infodata);
              //vuedata.tabs.unshift(infodata);
            },
            error:function(request, status, error){
            }
          });
        }
        if (searchstring==="favorites" || searchstring==="favoritesstartup")
        {
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: '/thing/brokersettings/favorites',
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(info) {
              if (info!=null && info.hasOwnProperty("type") && info.type==="favorites")
              {
                insertTab(info);
              }
              else
              {
                if (searchstring!="favoritesstartup")
                {
                  vuedata.$q.notify({
                    color: 'pink',
                    icon: 'report_problem',
                    message: 'No favorites configured!',
                    timeout: 3000
                  });    
                }
              }
              //vuedata.tabs.unshift(infodata);
            },
            error:function(request, status, error){
              if (searchstring!="favoritesstartup")
              {
                vuedata.$q.notify({
                  color: 'pink',
                  icon: 'report_problem',
                  message: 'No favorites configured!',
                  timeout: 3000
                });    
              } 
            }
          });
        }
        if (searchstring==="user")
        {
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: '/query/userdata',
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(userdata) {
              insertTab(userdata);
              //vuedata.tabs.unshift(userdata);
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: 'User information not found!',
                timeout: 3000
              });
            }
          });
        }
        if (searchstring.startsWith("user:"))
        {
          var username=searchstring.substring(5);
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: '/user/'+username,
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(userdata) {
              insertTab(userdata);
              //vuedata.tabs.unshift(userdata);
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: 'User information not found!',
                timeout: 3000
              });
            }
          });
        }
        if (searchstring.startsWith("thing:"))
        {
          var thingname=searchstring.substring(6);
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: 'thing/'+thingname,
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(thingdata) {
              thingdata.contentmodified=false;
              insertTab(thingdata);
              //vuedata.tabs.unshift(thingdata);
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: '/thing/'+thingname+' not found!',
                timeout: 3000
              });
            }
          });
        }

        if (searchstring.startsWith("ramvars:"))
        {
          var thingname=searchstring.substring(8);
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: 'query/thing/'+thingname+'/ram',
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(ramvars) {
              var obj={type:"varlist", memtype:"ram", thing: thingname, varlist: ramvars};
              insertTab(obj);
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: 'RAM-Vars of '+thingname+' not found or no access!',
                timeout: 3000
              });
            }
          });
        }

        if (searchstring.startsWith("dbvars:"))
        {
          var thingname=searchstring.substring(7);
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: 'query/thing/'+thingname+'/db',
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(ramvars) {
              var obj={type:"varlist", memtype:"db", thing: thingname, varlist: ramvars};
              insertTab(obj);
              //vuedata.tabs.unshift(obj);
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: 'DB-Vars of '+thingname+' not found or no access!',
                timeout: 3000
              });
            }
          });
        }

        if (searchstring.startsWith("var:"))
        {
          var path=searchstring.substring(4).split("/");
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: 'query/thing/'+path[0]+"/"+path[1]+"/"+path[2],
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(value)
            {
              var obj={type:"var", thing:path[0], memtype:path[1], varname: path[2], value: JSON.stringify(value,null,"  ")};
              insertTab(obj);
            },
            error:function(request, status, error)
            {
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: 'Variable '+path[0]+"/"+path[1]+"/"+path[2]+' not found or no access!',
                timeout: 3000
              });
            }
          });
        }

        if (searchstring.startsWith("help:"))
        {
          var name=searchstring.substring(5);
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: 'doc/'+name,
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
//            timeout: 700,
            context: $('body'),
            success: function(markdowncontent) {
              var obj={type:"markdown", filename:name, markdown: markdowncontent, html: mdHtml.render(markdowncontent)};
              insertTab(obj);
              //vuedata.tabs.unshift(obj);
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: '/doc/'+name+' not found!',
                timeout: 3000
              });
            }
          });
        }
        if (searchstring.startsWith("key:"))
        {
          var keyname=searchstring.substring(4);
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: 'key/'+keyname,
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(keydata) {
              insertTab(keydata);
              //vuedata.tabs.unshift(keydata);
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: '/key/'+keyname+' not found!',
                timeout: 3000
              });
            }
          });
        }
        if (searchstring.startsWith("website:"))
        {
          var websitename=searchstring.substring(8);
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: '/query/website/'+websitename,
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(websitedata) {
              websitedata.uploadurl='/upload/website/'+websitename;
              insertTab(websitedata);
              //vuedata.tabs.unshift(keydata);
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: '/website/'+websitename+' not found!',
                timeout: 3000
              });
            }
          });
        }
        if (searchstring.startsWith("file:"))
        {
          var file=searchstring.substring(5);
          if (file.indexOf("/")>=0)
          {
            var websitename=file.substring(0,file.indexOf("/"));
            var filepath=file.substring(file.indexOf("/"));
            // file:test123/index.html
            $.ajax({
              type: 'GET',
              headers:{
                'Cache-Control': 'no-cache, no-store'
              },
              url: '/query/website/'+websitename+"/files"+filepath,
              // data to be added to query string:
              data: {},
              // type of data we are expecting in return:
              dataType: 'json',
  //            timeout: 700,
              context: $('body'),
              success: function(websiteitem) {
                websiteitem.contentmodified=false;
                insertTab(websiteitem);
              },
              error:function(request, status, error){
                vuedata.$q.notify({
                  color: 'pink',
                  icon: 'report_problem',
                  message: 'File /website/'+websitename+filepath+' not found!',
                  timeout: 3000
                });
              }
            });
          }
        }
        if (searchstring.startsWith("createfile:"))
        {
          var file=searchstring.substring(11);
          if (file.indexOf("/")>=0 && (file.endsWith("/")==false))
          {
            var website=file.substring(0,file.indexOf("/"));
            var filepath=file.substring(file.indexOf("/"));
            this.createFile(website,filepath)
          }
          else
          {
            vuedata.$q.notify({
              color: 'pink',
              icon: 'report_problem',
              message: 'Invalid filename '+file,
              timeout: 3000
            });
          }
        }
        if (searchstring.startsWith("mythings"))
        {
          var searchargument=searchstring.substring(9);
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: 'query/mythings',
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(list) {
              list.sort(function(a, b) {
                var nameA = a.thing.toUpperCase(); // ignore upper and lowercase
                var nameB = b.thing.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }

                // namen müssen gleich sein
                return 0;
              });
              insertTab({type:"thingslist", list:list});
              //vuedata.tabs.unshift({type:"thingslist", list:list});
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: 'Things list not found!',
                timeout: 3000
              });
            }
          });
        }
        if (searchstring.startsWith("mykeys"))
        {
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: 'query/mykeys',
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(list) {
              insertTab({type:"keyslist", list:list});
//              vuedata.tabs.unshift({type:"keyslist", list:list});
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: 'Keys list not found!',
                timeout: 3000
              });
            }
          });
        }
        if (searchstring.startsWith("mywebsites"))
        {
          $.ajax({
            type: 'GET',
            headers:{
              'Cache-Control': 'no-cache, no-store'
            },
            url: 'query/mywebsites',
            // data to be added to query string:
            data: {},
            // type of data we are expecting in return:
            dataType: 'json',
//            timeout: 700,
            context: $('body'),
            success: function(list) {
              insertTab({type:"websiteslist", list:list});
              //vuedata.tabs.unshift({type:"websiteslist", list:list});
            },
            error:function(request, status, error){
              vuedata.$q.notify({
                color: 'pink',
                icon: 'report_problem',
                message: 'Websites list not found!',
                timeout: 3000
              });
            }
          });
        }
      },
      sign_in: function(event) {
        var jsonToQueryString=function(json) {return '?' +
          Object.keys(json).map(function(key) {
              return encodeURIComponent(key) + '=' +
                  encodeURIComponent(json[key]);
          }).join('&');
        };
        document.location.href="/login"+jsonToQueryString({ user: this.logindata.user, password: pwdsalt(this.logindata.pwd) });
      },
      openLink: function(link)
      {
        document.location.href=link;
      },
      sign_out: function(event) {
        document.location.href="/logout";
      },
      openURL: function(url) {
        Quasar.utils.openURL(url)
      },
      setcolor: function(r,g,b){
        setIoTVariable('etecturm','led_red',r);
        setIoTVariable('etecturm','led_green',g);
        setIoTVariable('etecturm','led_blue',b);
      }
    },
    computed: {
      countModified: function()
      {
        var res=0;
        for(var i=0;i<this.tabs.length;i++)
        {
          if (this.tabs[i].contentmodified===true) res++;
        }
        document.title = ((res>0)?"* ":"")+"IoTB "+this.info.brokerversion
        return res;
      }
    },
    mounted: function() {
      var defaults = {
        html:         false,        // Enable HTML tags in source
        xhtmlOut:     false,        // Use '/' to close single tags (<br />)
        breaks:       false,        // Convert '\n' in paragraphs into <br>
        langPrefix:   'language-',  // CSS language prefix for fenced blocks
        linkify:      true,         // autoconvert URL-like texts to links
        linkTarget:   '',           // set target to open link in
        typographer:  true,         // Enable smartypants and other sweet transforms

        // options below are for demo only
        _highlight: true,
        _strict: false,
        _view: 'html'               // html / src / debug
      };

      defaults.highlight = function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (err) {}
        }

        try {
          return hljs.highlightAuto(str).value;
        } catch (err) {}

        return ''; // use external default escaping
      }

      mdHtml = new window.Remarkable('full', defaults);

      var vuedata=this;
      $.ajax({
        type: 'GET',
        headers:{
          'Cache-Control': 'no-cache, no-store'
        },
        url: '/query/userdata',
        // data to be added to query string:
        data: {},
        // type of data we are expecting in return:
        dataType: 'json',
//        timeout: 700,
        context: $('body'),
        success: function(userdata) {
          vuedata.user=userdata;
        },
        error:function(request, status, error){
          vuedata.user=null;
        }
      });

      $.ajax({
        type: 'GET',
        headers:{
          'Cache-Control': 'no-cache, no-store'
        },
        url: '/query/info',
        // data to be added to query string:
        data: {},
        // type of data we are expecting in return:
        dataType: 'json',
//        timeout: 700,
        context: $('body'),
        success: function(info) {
          vuedata.info=info;
        },
        error:function(request, status, error){

        }
      });
  
      this.search("favoritesstartup");


      if (getAllUrlParams().hasOwnProperty("subscribe"))
      {
        var topic=decodeURI(getAllUrlParams().subscribe);
        this.search("subscribe:"+topic);
      }
    }
  });
};
