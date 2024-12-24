// *********************************************************************
// IoTB - Thing-Script
// Copyright (C) 2018-2024 DI Weichinger Klaus,MSc, snaky.1@gmx.at
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

var thingscript = function()
{
  var compile=function(prog, options)
  {
    var context={};
  /*
    instructions=statement ";" { statement ";" }
  */

    var functions={
      // built in functions

      abs: function(context,args)
      {
        if (args.length==1)
        {
          return Math.abs(Number(args[0]()));
        } else return 0.0;
      },

      acos: function(context,args)
      {
        if (args.length==1)
        {
          return Math.acos(Number(args[0]()));
        } else return 0.0;
      },

      acosh: function(context,args)
      {
        if (args.length==1)
        {
          return Math.acosh(Number(args[0]()));
        } else return 0.0;
      },

      asin: function(context,args)
      {
        if (args.length==1)
        {
          return Math.asin(Number(args[0]()));
        } else return 0.0;
      },

      asinh: function(context,args)
      {
        if (args.length==1)
        {
          return Math.asinh(Number(args[0]()));
        } else return 0.0;
      },

      atan: function(context,args)
      {
        if (args.length==1)
        {
          return Math.atan(Number(args[0]()));
        } else return 0.0;
      },

      atan2: function(context,args)
      {
        if (args.length==2)
        {
          return Math.atan2(Number(args[0]()),Number(args[1]()));
        } else return 0.0;
      },

      cbrt: function(context,args)
      {
        if (args.length==1)
        {
          return Math.cbrt(Number(args[0]()));
        } else return 0.0;
      },

      ceil: function(context,args)
      {
        if (args.length==1)
        {
          return Math.ceil(Number(args[0]()));
        } else return 0.0;
      },

      cos: function(context,args)
      {
        if (args.length==1)
        {
          return Math.cos(Number(args[0]()));
        } else return 0.0;
      },

      cosh: function(context,args)
      {
        if (args.length==1)
        {
          return Math.cosh(Number(args[0]()));
        } else return 0.0;
      },

      exp: function(context,args)
      {
        if (args.length==1)
        {
          return Math.exp(Number(args[0]()));
        } else return 0.0;
      },

      floor: function(context,args)
      {
        if (args.length==1)
        {
          return Math.floor(Number(args[0]()));
        } else return 0.0;
      },

      ln: function(context,args)
      {
        if (args.length==1)
        {
          return Math.log(Number(args[0]()));
        } else return 0.0;
      },

      log: function(context,args)
      {
        if (args.length==1)
        {
          return Math.log(Number(args[0]()));
        } else return 0.0;
      },

      log10: function(context,args)
      {
        if (args.length==1)
        {
          return Math.log10(Number(args[0]()));
        } else return 0.0;
      },

      max: function(context,args)
      {
        if (args.length>=1)
        {
          var res=Number(args[0]());
          for(var i=1;i<args.length;i++)
          {
            res=Math.max(res,Number(args[i]()));
          }
          return res;
        } else return 0.0;
      },

      min: function(context,args)
      {
        if (args.length>=1)
        {
          var res=Number(args[0]());
          for(var i=1;i<args.length;i++)
          {
            res=Math.min(res,Number(args[i]()));
          }
          return res;
        } else return 0.0;
      },

      pow: function(context,args)
      {
        if (args.length==2)
        {
          return Math.pow(Number(args[0]()),Number(args[1]()));
        } else return 0.0;
      },

      random: function(context, args)
      {
        if (args.length==2)
        {
          var start=Math.floor(args[0]());
          var stop=Math.floor(args[1]());
          var range=stop-start+1;
          return Math.floor((Math.random()*range)+start);
        } else return Math.random();
      },

      round: function(context,args)
      {
        if (args.length==1)
        {
          return Math.round(Number(args[0]()));
        } else return 0.0;
      },

      sin: function(context,args)
      {
        if (args.length==1)
        {
          return Math.sin(Number(args[0]()));
        } else return 0.0;
      },

      sinh: function(context,args)
      {
        if (args.length==1)
        {
          return Math.sinh(Number(args[0]()));
        } else return 0.0;
      },

      sqrt: function(context,args)
      {
        if (args.length==1)
        {
          return Math.sqrt(Number(args[0]()));
        } else return 0.0;
      },

      tan: function(context,args)
      {
        if (args.length==1)
        {
          return Math.tan(Number(args[0]()));
        } else return 0.0;
      },

      tanh: function(context,args)
      {
        if (args.length==1)
        {
          return Math.tanh(Number(args[0]()));
        } else return 0.0;
      },

      trunc: function(context,args)
      {
        if (args.length==1)
        {
          return Math.trunc(Number(args[0]()));
        } else return 0.0;
      },

      length: function(context,args)
      {
        var res=0;
        if (args.length==1)
        {
          var s=args[0]();
          if (typeof s==="string")
          {
            res=s.length;
          }
          else if ((typeof s==="object") && (Array.isArray(s)))
          {
            res=s.length;
          }
          else if (typeof s==="object")
          {
            res=Object.keys(s).length;
          }
        }
        return res;
      },

      PI: function(context,args)
      {
        return Math.PI;
      },

      E: function(context,args)
      {
        return Math.E;
      },

      Number: function(context, args)
      {
        if (args.length==1)
        {
          return Number(args[0]());
        }
        else if (args.length==2){
          return Number(Number(args[0]()).toFixed(Number(args[1]())));
        }
        else return 0.0;
      },

      sliceString: function(context,args)
      {
        if (args.length==2)
        {
          var s=args[0]();
          var length=Number(args[1]());

          if (typeof s ==="string")
          {
            if (length>=0)
            {
              return s.slice(0,length);
            }
            else
            {
              return s.slice(length);
            }
          } else return "";
        }
        else {
          return "";
        }
      },

      subString: function(context,args)
      {
        if (args.length==3)
        {
          var s=args[0]();
          var start=Number(args[1]());
          var length=Number(args[2]());
          if (start<0) start=0;
          if (start>=s.length) start=s.length-1;
          if ((start+length)>s.length) length=s.length-start;
          if (typeof s ==="string")
          {
            return s.substr(start,length);
          } else return "";
        }
        else {
          return "";
        }
      },

      subStringBefore: function(context,args)
      {
        if (args.length==2)
        {
          var s=args[0]();
          var splitter=args[1]();
          var i=s.indexOf(splitter);
          if ( i<0)
          {
            return "";
          }
          else {
            return s.substr(0,i);
          }
        }
        else return "";
      },

      subStringAfter: function(context,args)
      {
        if (args.length==2)
        {
          var s=args[0]();
          var splitter=args[1]();
          var i=s.indexOf(splitter);
          if ( i<0)
          {
            return "";
          }
          else {
            return s.substr(i+splitter.length,s.length-i-splitter.length);
          }
        }
        else return "";
      },

      replaceString: function(context,args)
      {
        if (args.length==3)
        {
          var org=args[0]();
          var old=args[1]();
          var news=args[2]();
          return org.replace(new RegExp(old,"g"),news);
        }
        else return "";
      },

      replaceStringAt: function(context, args)
      {
        if(args.length==3)
        {
          var org=args[0]();
          var index=Number(args[1]());
          var str=args[2]();

          if (index<0) {
            str=str.slice(-index);
            index=0;
          }
          var head=org.slice(0,index);
          var tail=org.slice(index+str.length)
          var res=head+str+tail;

          res=res.slice(0,org.length);
          return res;
        }
        else return "";
      },

      containsString: function(context, args)
      {
        if (args.length==2)
        {
          return args[0]().includes(args[1]());
        }
        else return false;
      },

      splitString: function(context, args)
      {
        if(args.length==2)
        {
          return args[0]().split(args[1]());
        }
        else return [];
      },

      toUpperCase: function(context,args)
      {
        if (args.length==1)
        {
          return args[0]().toUpperCase();
        }
        else return "";
      },

      toLowerCase: function(context,args)
      {
        if (args.length==1)
        {
          return args[0]().toLowerCase();
        }
        else return "";
      },

      toCharCodes:function(context,args)
      {
        if (args.length==1)
        {
          var s=args[0]();
          var res=[];
          for(let i = 0; i < s.length; i++){
            res.push( s.charCodeAt(i));
          }
          return res;
        }
        else return [];
      },

      fromCharCodes:function(context,args)
      {
        if (args.length==1)
        {
          var charcodes=args[0]();
          try{
            return String.fromCharCode(...charcodes);
          } catch {error}
          {
            return "xx";
          }
        }
        else return "yy";
      },
            
      toJson: function(context,args)
      {
        if(args.length==1)
        {
          return JSON.stringify(args[0]());
        }
        else if(args.length==2)
        {
          if (args[1]()===true)
          {
            return JSON.stringify(args[0](),null,2);
          } else {
            return JSON.stringify(args[0]());

          }
        }
          else return undefined;
      },

      fromJson: function(context,args)
      {
        if(args.length==1)
        {
          return JSON.parse(args[0]());
        }
        else return undefined;
      },

      toBase64: function(context,args)
      {
        if(args.length==1)
        {
          try{
            //return "";
            var buff=Buffer.from(new Uint8Array(args[0]()));
            return buff.toString("base64");
          }
          catch(e)
          {
            console.log(e);
            return undefined;
          }
        }
        else return undefined;
      },

      fromBase64: function(context,args)
      {
        if(args.length==1)
        {
          try{
            //return [];
            var buff=Buffer.from(args[0](),"base64");
            
            return atob(args[0]()).split('').map(function (c) { return c.charCodeAt(0); });
          }
          catch(e)
          {
            return undefined;
          }
        }
        else return undefined;        
      },

      dec2HEX: function(context,args)
      {
        if (args.length==1)
        {
          return Number(args[0]()).toString(16).toUpperCase();
        }
        return "0";
      },

      dec2hex: function(context,args)
      {
        if (args.length==1)
        {
          return Number(args[0]()).toString(16).toLowerCase();
        }
        return "0";
      },

      hex2dec: function(context,args)
      {
        if (args.length==1)
        {
          return parseInt(args[0](),16);
        }
        return 0;
      },

      unixtime:function(context,args)
      {
        var unix=Date.now();
        if (args.length==1)
        {
          unix=new Date(args[0]()).getTime();
        } else if (args.length==7)
        {
          unix=new Date(Number(args[0]()),Number(args[1]()),Number(args[2]()),Number(args[3]()),Number(args[4]()),Number(args[5]()),Number(args[6]())).getTime();
        }
        return unix;
      },

      unixtime2string:function(context, args)
      {
        var res="";
        if (args.length==2)
        {
          var unix=args[0]();
          var timestamp=new Date(unix);
          var year="00000000"+timestamp.getFullYear();
          var month="00000000"+(timestamp.getMonth()+1);
          var day="00000000"+timestamp.getDate();

          var weekday=timestamp.getDay();
          if (weekday==0) weekday=7;

          var hours="00000000"+timestamp.getHours();
          var minutes="00000000"+timestamp.getMinutes();
          var seconds="00000000"+timestamp.getSeconds();
          var milliseconds="00000000"+timestamp.getMilliseconds();

          var timeInMinutes=hours*60+Number(minutes);
          var timeInSeconds=timeInMinutes*60+Number(seconds);
          var timeInMilliseconds=timeInSeconds*1000+Number(milliseconds);

          var isoTimeStamp=timestamp.toISOString();

          res=args[1]();
          res=res.replace("%unixtime",unix);
          res=res.replace("%YYYY",year.slice(-4));
          res=res.replace("%WD",weekday);
          res=res.replace("%MM",month.slice(-2));
          res=res.replace("%DD",day.slice(-2));
          res=res.replace("%hh",hours.slice(-2));
          res=res.replace("%mm",minutes.slice(-2));
          res=res.replace("%ss",seconds.slice(-2));
          res=res.replace("%ms",milliseconds.slice(-3));
          res=res.replace("%time_min",timeInMinutes);
          res=res.replace("%time_sec",timeInSeconds);
          res=res.replace("%time_ms",timeInMilliseconds);
          res=res.replace("%iso",isoTimeStamp);
        }
        else
        {
          res=isoTimeStamp;
        }
        return res;
      },

      now:function(context, args)
      {
        var unix=Date.now();
        var timestamp=new Date(unix);
        var year="00000000"+timestamp.getFullYear();
        var month="00000000"+(timestamp.getMonth()+1);
        var day="00000000"+timestamp.getDate();

        var weekday=timestamp.getDay();
        if (weekday==0) weekday=7;

        var hours="00000000"+timestamp.getHours();
        var minutes="00000000"+timestamp.getMinutes();
        var seconds="00000000"+timestamp.getSeconds();
        var milliseconds="00000000"+timestamp.getMilliseconds();

        var timeInMinutes=hours*60+Number(minutes);
        var timeInSeconds=timeInMinutes*60+Number(seconds);
        var timeInMilliseconds=timeInSeconds*1000+Number(milliseconds);

        var isoTimeStamp=timestamp.toISOString();

        var res="";
        if (args.length==1)
        {
          res=args[0]();
          res=res.replace("%unixtime",unix);
          res=res.replace("%YYYY",year.slice(-4));
          res=res.replace("%WD",weekday);
          res=res.replace("%MM",month.slice(-2));
          res=res.replace("%DD",day.slice(-2));
          res=res.replace("%hh",hours.slice(-2));
          res=res.replace("%mm",minutes.slice(-2));
          res=res.replace("%ss",seconds.slice(-2));
          res=res.replace("%ms",milliseconds.slice(-3));
          res=res.replace("%time_min",timeInMinutes);
          res=res.replace("%time_sec",timeInSeconds);
          res=res.replace("%time_ms",timeInMilliseconds);
          res=res.replace("%iso",isoTimeStamp);
        }
        else
        {
          res=isoTimeStamp;
        }
        return res;
      },

      exists: function(context,args)
      {
        if (args.length==1) {
          var x=args[0]();
          if (typeof x==="string") return (context.scriptvars.hasOwnProperty(args[0]()))?true:false;
        }
        return false;
      },
      defined: function(context, args)
      {
        if (args.length==1) {
          var x=args[0]();
          return (typeof x==="undefined")?false:true;
        }
        return false;
      },

      pushArray: function(context, args)
      {
        if (args.length==2)
        {
          args[0]().push(args[1]());
        }
      },
      popArray: function(context, args)
      {
        var res=undefined;
        if (args.length==1)
        {
          if (args[0]().length>0) res=args[0]().pop();
        };
        return res;
      },
      unshiftArray: function(context, args)
      {
        var res=undefined;
        if (args.length==2)
        {
          args[0]().unshift(args[1]());
        };
      },
      shiftArray: function(context, args)
      {
        var res=undefined;
        if (args.length==1)
        {
          if (args[0]().length>0) res=args[0]().shift();
        };
        return res;
      },
      insertArrayAt: function(context, args)
      {
        if(args.length==3)
        {
          var arr=args[0]();
          var index=Number(args[1]());
          var item=args[2]();
          if (index<0)
          {
            if (index==-1)
            {
              index=arr.length;
            }
            index+=1;
          }
          arr.splice(index,0,item);
        }
        return undefined;
      },
      replaceArrayAt: function(context, args)
      {
        var res=undefined;
        if(args.length==3)
        {
          var arr=args[0]();
          var index=Number(args[1]());
          var item=args[2]();
          if (index<0)
          {
            index+=1;
            if (index<0) res=arr.splice(index,1,item)[0];
          }
          else
          {
            res=arr.splice(index,1,item)[0];
          }
        }
        return res;
      },
      removeArrayAt: function(context, args)
      {
        var res=undefined;
        if(args.length==2)
        {
          var arr=args[0]();
          var index=Number(args[1]());
          if (index<0)
          {
            index+=1;
            if (index<0) res=arr.splice(index,1)[0];
          }
          else
          {
            res=arr.splice(index,1)[0];
          }
        }
        return res;
      },
      removeFromArray: function(context, args)
      {
        var res=false;
        if (args.length==2)
        {
          var arr=args[0]();
          var obj=args[1]();
          var index=arr.indexOf(obj);
          if (index>=0) {
            arr.splice(index,1);
            res=true;
          }
        }
        return res;
      },

      meanFromArray:function(context, args)
      {
        var sum=NaN;
        if (args.length==1)
        {
          var arr=args[0]();
          var l=arr.length;
          if (l>0)
          {
            sum=0;
            for(var i=0;i<arr.length;i++)
            {
              sum+=Number(arr[i]);
            }
            sum/=arr.length;
          }
        }
        return sum;
      },

      medianFromArray:function(context, args)
      {
        var res=NaN;
        if (args.length==1)
        {
          var arr=args[0]().map(x=>Number(x));
          arr.sort((a,b)=>a-b);
          var l=arr.length;
          if (l>0)
          {
            if (l%2==0)
            {
              var idx=Math.floor(l/2);
              res=(arr[idx]+arr[idx-1])/2;
            }
            else
            {
              res=arr[Math.floor(l/2)];
            }
          }          
        }
        return res;
      },

      maxFromArray:function(context, args)
      {
        var res=NaN;
        if (args.length==1)
        {
          var arr=args[0]();
          if (Array.isArray(arr))
          {
            res=arr[0];
            for(var i=1;i<arr.length;i++)
            {
              if (arr[i]>res) res=arr[i];
            }
          }
        }
        return res;
      },

      minFromArray:function(context, args)
      {
        var res=NaN;
        if (args.length==1)
        {
          var arr=args[0]();
          if (Array.isArray(arr))
          {
            res=arr[0];
            for(var i=1;i<arr.length;i++)
            {
              if (arr[i]<res) res=arr[i];
            }
          }
        }
        return res;
      },

      matT:function(context, args)
      {
        var res=[];
        if (args.length==1)
        {
          var matA=args[0]();
          if (Array.isArray(matA) && matA.length>0 && Array.isArray(matA[0]))
          {
            var m=matA.length;
            var n=matA[0].length;
            for(var c=0;c<n;c++)
            {
              var row=[];
              for(var r=0;r<m;r++)
              {
                row.push(matA[r][c]);
              }
              res.push(row);
            }
          }
        }
        return res;
      },

      matAdd:function(context, args)
      {
        var res=[];
        if (args.length==2)
        {
          // e.g. 3x2:  [[1,2],[3,4],[5,6]];
          // mxn x nxp
          var matA=args[0]();
          var matB=args[1]();
          if (Array.isArray(matA) && matA.length>0 && Array.isArray(matA[0]) && Array.isArray(matB) && matB.length>0 && Array.isArray(matB[0]))
          {
            var m=matA.length;
            var n=matA[0].length;
            if (m==matB.length && n==matB[0].length)
            {
              for(var r=0;r<m;r++)
              {
                var row=[];
                for(var c=0;c<n;c++)
                {
                  row.push(matA[r][c]+matB[r][c]);
                }
                res.push(row);
              }
            }
          }
        }
        return res;
      },


      matMul:function(context, args)
      {
        var res=[];
        if (args.length==2)
        {
          // e.g. 3x2:  [[1,2],[3,4],[5,6]];
          // mxn x nxp
          var matA=args[0]();
          var matB=args[1]();
          if (Array.isArray(matA) && matA.length>0 && Array.isArray(matA[0]) && Array.isArray(matB) && matB.length>0 && Array.isArray(matB[0]))
          {
            var m=matA.length;
            var n=matA[0].length;
            var p=matB[0].length;
            if (n==matB.length)
            {
              for(var r=0;r<m;r++)
              {
                var row=[];
                for(var c=0;c<p;c++)
                {
                  var sum=0;
                  for(var i=0;i<n;i++)
                  {
                    sum+=matA[r][i]*matB[i][c];
                  }
                  row.push(sum);
                }
                res.push(row);
              }
            }
          }
        }
        return res;
      }
      

    };

    if (options && options.functions)
    {
      for(var fun in options.functions)
      {
        functions[fun]=options.functions[fun];
      }
    }

    var charsa_z="abcdefghijklmnopqrstuvwxyz";
    var charsA_Z="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var chars0_9="0123456789";
    var charsfloatnumber="0123456789.";
    var charsfloatnumberext="0123456789.eE";
    var chars0_F="0123456789ABCDEFabcdef";

    var parserstring=prog;
    var parserpos=0;
    var parsererror=null;

    var parseError=function(name, msg)
    {
      throw {
        name: name,
        message: msg
      };
    }

    var eof=function() {
      return (parserpos>=parserstring.length)?true:false;
    };

    var isSetter=function(obj, prop) {
      return  obj.hasOwnProperty(prop) && (!!Object.getOwnPropertyDescriptor(obj, prop)['set']);
    }

    var isGetter=function(obj, prop) {
      return (obj!=null) && obj.hasOwnProperty(prop) && (!!Object.getOwnPropertyDescriptor(obj, prop)['get']);
    }

    var isSpace = function(aChar)
    {
      myCharCode = aChar.charCodeAt(0);

      if(((myCharCode >  8) && (myCharCode < 14)) ||
         (myCharCode == 32))
      {
         return true;
      }

      return false;
    }

    var getChar=function() {
      if (!eof()) return parserstring[parserpos];
      return '\0';
    };

    var getChars=function(count) {
      var oldpos=parserpos;
      var res="";
      for(var i=0;i<count;i++)
      {
        if (!eof()) {
          res+=parserstring[parserpos];
          parserpos++;
        }
        else {
          res="";
          break;
        }
      }
      parserpos=oldpos;
      return res;
    };

    var stepNext=function() {
      do {
        parserpos++;
      } while (!eof() && isSpace(getChar()));
    };

    var skipSpace=function() {
      while (!eof() && (isSpace(getChar()) || getChar()=="/")) {
        if (getChar()=="/")
        {
          var oldpos=parserpos;
          parserpos++;
          if (getChar()=="/")
          {
            parserpos++;
            // line comment
            while(!eof() && getChar()!='\n' && getChar()!='\r')
            {
              parserpos++;
            }
          }
          else if (getChar()=="*")
          {
            parserpos++;
            var oldvar="";
            while(!eof() && ((oldvar=='*' && getChar()=='/')==false))
            {
              oldvar=getChar();
              parserpos++;
            }
          }
          else {
            parserpos=oldpos;
            break;
          }
        }
        parserpos++;
      }
    };

    var parseIdent=function() {
      var ident=null;
      var c=getChar();
      var startchars=charsA_Z+charsa_z+"_";
      var chars=charsA_Z+charsa_z+chars0_9+"_";
      if (startchars.indexOf(c)>=0)
      {
        ident=c;
        parserpos++;
        c=getChar();
        while(!eof() && (chars.indexOf(getChar())>=0))
        {
          ident+=c;
          parserpos++;
          c=getChar();
        }
      }
      return ident;
    };

    var parseDesignator=function() {
      var res=null;
      var ident=parseIdent();
      if (ident && ident.length>0)
      {
        res=ident;
        while(!eof())
        {
          if(getChar()==".")
          {
            if (typeof res==="string") res=[res];
            parserpos++;
            ident=parseIdent();
            if (ident!=null) res.push(ident);
            else {
              parseError('Invalident variablenname!');
            }
          }
          else if(getChar()=="[")
          {
            if (typeof res==="string") res=[res];
            parserpos++;
            skipSpace();
            ident=parseExpression();
            skipSpace();
            if (getChar()=="]")
            {
              parserpos++;
              res.push(ident);
            }
            else {
              res=null;
              parseError('Missing ] for array index or object propoerty');
            }
          }
          else {
            break;
          }
        }
      }
      return res;
    };

    var parseArgs=function()
    {
      var funargs=[];
      skipSpace();
      if (getChar()!=")")
      {
        funargs.push(parseExpression());
        skipSpace();
        while(getChar()==",")
        {
          parserpos++;
          funargs.push(parseExpression());
          skipSpace();
        }
      }
      return function(){
        return funargs;
      };
    }

    var parseObject=function()
    {
      var keys=[];
      skipSpace();
      if (getChar()!="}")
      {
        var ident=parseIdent();
        while(!eof() && ident!=null)
        {
          skipSpace();
          if (getChar()==":")
          {
            parserpos++;
            var expr=parseExpression();
            var kvp={key:ident, value:expr};
            keys.push(kvp);
            skipSpace();
            ident=null;
            if (getChar()==",") {
              parserpos++;
              skipSpace();
              if (getChar()!="}") ident=parseIdent();
            }
          }
          else {
            parseError('Missing : for object');
            ident=null;
          }
        }
      };
      return function()
      {
        var obj={};
        for(var i=0;i<keys.length;i++)
        {
          obj[keys[i].key]=keys[i].value();
        }
        return obj;
      }
    }

    var parseArray=function()
    {
      var arr=[];
      skipSpace();
      if (getChar()!="]")
      {
        var expr=1;
        while(!eof() && expr!=null)
        {
          expr=parseExpression();
          arr.push(expr);
          skipSpace();
          if (getChar()!=",") expr=null;
          else {
            parserpos++;
            skipSpace();
            if (getChar()=="]") expr=null;
          }
        }
      };
      return function()
      {
        var res=[];
        for(var i=0;i<arr.length;i++)
        {
          res.push(arr[i]());
        }
        return res;
      }
    }

    var parseFactor=function()
    {
      skipSpace();
      var c=getChar();
      if (charsfloatnumber.indexOf(c)>=0)
      {
        var number=c;
        var floatnumber;
        parserpos++;
        var prev=c;
        while(charsfloatnumber.indexOf(getChar())>=0 || getChar()==="e"|| getChar()==="E" || ((prev==="e" || prev==="E")&&(getChar()==="+" || getChar()==="-")))
        {
          prev=getChar();
          number+=prev;
          parserpos++;
        }
        floatnumber=Number(number);
        return function(){return floatnumber;};
      }

      else if (c=='"')
      {
        parserpos++;
        var s="";
        while(!eof())
        {
          var c=getChar();
          parserpos++;
          if (c=='"')
          {
            break;
          }

          var escape=c+getChar();
               if(escape=="\\\\") { s+="\\"; parserpos++; }
          else if(escape=="\\\"") { s+="\""; parserpos++; }
          else if(escape=="\\\'") { s+="\'"; parserpos++; }
          else if(escape=="\\b")  { s+="\b"; parserpos++; }
          else if(escape=="\\f")  { s+="\f"; parserpos++; }
          else if(escape=="\\n")  { s+="\n"; parserpos++; }
          else if(escape=="\\r")  { s+="\r"; parserpos++; }
          else if(escape=="\\t")  { s+="\t"; parserpos++; }
          else if(escape=="\\v")  { s+="\v"; parserpos++; }
          else {
            s+=c;
          }
        }
        return function(){return s;};
      }
      else if (c=="'")
      {
        parserpos++;
        var s="";
        while(!eof())
        {
          var c=getChar();
          parserpos++;
          if (c=="'")
          {
            break;
          }

          var escape=c+getChar();
               if(escape=="\\\\") { s+="\\"; parserpos++; }
          else if(escape=="\\\"") { s+="\""; parserpos++; }
          else if(escape=="\\\'") { s+="\'"; parserpos++; }
          else if(escape=="\\b")  { s+="\b"; parserpos++; }
          else if(escape=="\\f")  { s+="\f"; parserpos++; }
          else if(escape=="\\n")  { s+="\n"; parserpos++; }
          else if(escape=="\\r")  { s+="\r"; parserpos++; }
          else if(escape=="\\t")  { s+="\t"; parserpos++; }
          else if(escape=="\\v")  { s+="\v"; parserpos++; }
          else {
            s+=c;
          }
        }
        return function(){return s};
      }
      else if (c=="{")
      {
        parserpos++;
        var obj=parseObject();
        skipSpace();
        if (getChar()=="}")
        {
          parserpos++;
          return function(){return obj();};
        }
        else {
          parseError('Missing } at object');
        }
      }
      else if (c=="[")
      {
        parserpos++;
        var arr=parseArray();
        skipSpace();
        if (getChar()=="]")
        {
          parserpos++;
          return function(){return arr();};
        }
        else {
          parseError('Missing ], non empty array []');
        }
      }
      else if (c=="(")
      {
        parserpos++;
        var expression=parseExpression();
        skipSpace();
        if (getChar()==")")
        {
          parserpos++;
          return expression;
        }
        else
        {
          parseError('Missing )');
        }
      }
      else if (c=="-")
      {
        parserpos++;
        var fun=parseFactor();
        return function(){return -fun();}
      }
      else if (c=="+")
      {
        parserpos++;
        var fun=parseFactor();
        return fun;
      }
      else if (c=="!")
      {
        parserpos++;
        var fun=parseFactor();
        return function(){return !fun();}
      }
      else
      {
        var varname=parseDesignator();
        var funargs;
        if((typeof varname==="string") && getChar()=="(")
        {
          if (functions.hasOwnProperty(varname)==false)
          {
            parseError('Unkown function "'+varname+'"');
          }
          parserpos++;
          funargs=parseArgs();
          skipSpace();
          if (getChar()==")")
          {
            parserpos++;
            return function() {
              return functions[varname](context,funargs());
            };
          }
          else {
            parseError('Missing )');
          }
        }
        else
        {
          if (typeof varname==="string")
          {
            if (varname=="true") return function(){return true;}
            if (varname=="false") return function(){return false;}
            if (varname=="null") return function(){return null;}
            if (varname=="NaN") return function(){return NaN;}
            return function()
            {
              // fix here for objects
              if (context.scriptvars[varname] && (typeof context.scriptvars[varname]==="object") && isGetter(context.scriptvars[varname],"value"))
              {
                return context.scriptvars[varname].value;
              }
              else
              {
                return context.scriptvars[varname];
              }
            };
          }
          else if(typeof varname==="object" && varname!=null) // then it is a list of properties x.y.z ["x","y","z"]
          {
            return function()
            {
              var v=context.scriptvars;
              var localvarname=[];
              for(var i=0;i<varname.length;i++)
              {
                var prop=varname[i];
                if (typeof prop==="function")
                {
                  prop=prop();
                  if (typeof prop==="object")
                  {
                    for (var j=0;j<prop.length;j++)
                    {
                      localvarname.push(prop[j]);
                    }
                  }
                  else
                  {
                    localvarname.push(prop);
                  }
                }
                else
                {
                  localvarname.push(prop);
                }
              }
              for(var i=0;i<localvarname.length;i++)
              {
                var prop=localvarname[i];
                if (v.hasOwnProperty(prop) && (typeof v[prop]==="object") && isGetter(v[prop],"value"))
                {
                  if (i<localvarname.length-1) v=v[prop].value;
                  else return v[prop].value;
                }
                else if (v.hasOwnProperty(prop))
                {
                  if (i<localvarname.length-1) v=v[prop];
                  else return v[prop];
                }
                else
                {
                  return undefined;
                }
              }
            };
/*            
            return function()
            {
              var v=context.scriptvars;
              for(var i=0;i<varname.length;i++)
              {
                var prop=varname[i];
                if (typeof prop==="function")
                {
                  prop=prop();
                }
                if (v.hasOwnProperty(prop) && (typeof v[prop]==="object") && isGetter(v[prop],"value"))
                {
                  if (i<varname.length-1) v=v[prop].value;
                  else return v[prop].value;
                }
                else if (v.hasOwnProperty(prop))
                {
                  if (i<varname.length-1) v=v[prop];
                  else return v[prop];
                }
                else
                {
                  return undefined;
                }
              }
            };
*/            
          }
        }
      }
    }

    var parseTerm=function()
    {
      var fncs=[];
      skipSpace();
      fncs.push({op:"", fnc:parseFactor()});
      skipSpace();
      while(getChar()=="*" || getChar()=="/" || getChar()=="%")
      {
        var op=getChar();
        parserpos++;
        fncs.push({op:op, fnc:parseFactor()});
        skipSpace();
      }
      if (fncs.length==1) return fncs[0].fnc;
      else
      return function(){
        var res;
        for(var i=0;i<fncs.length;i++)
        {
          if (i==0)
          {
            res=fncs[i].fnc();
          }
          else
          {
            if (fncs[i].op=="*")
            {
              res*=fncs[i].fnc();
            }
            else if (fncs[i].op=="/")
            {
              res/=fncs[i].fnc();
            }
            else if (fncs[i].op=="%")
            {
              res%=fncs[i].fnc();
            }
          }
        }
        return res;
      }
    }


    var parseSum=function()
    {
      var fncs=[];
      skipSpace();
      var op="+";
      var term=parseTerm();
      fncs.push({op:op, fnc:term});
      skipSpace();

      while(getChar()=="+" || getChar()=="-")
      {
        op=getChar();
        parserpos++;
        var term=parseTerm();
        fncs.push({op:op, fnc:term});
        skipSpace();
      }
      if (fncs.length==1 && fncs[0].op=="+") return fncs[0].fnc;
      else return function()
      {
        var res=fncs[0].fnc();
        for(var i=1;i<fncs.length;i++)
        {
          if (fncs[i].op=="+")
          {
            res+=fncs[i].fnc();
          }
          else if (fncs[i].op=="-")
          {
            res-=fncs[i].fnc();
          }
        }
        return res;
      }
    }

    var parseRelationOperator=function()
    {
      var oldpos=parserpos;
      var relop=getChar();
      parserpos++;
      relop=relop+getChar();
      parserpos++;
      if ((relop[0]==">" || relop[0]=="<") && relop[1]!="=")
      {
        parserpos--;
        relop=relop[0];
      }
      if (relop==">" || relop==">=" || relop=="<" || relop=="<=")
      {
        return relop;
      }
      else
      {
        if (relop[0]==">" || relop[0]=="<")
        {
          parseError("Invalid relational operator "+relop);
        }
        else {
          parserpos=oldpos;
          return "";
        }
      }
    }

    var parseComparisonOperator=function()
    {
      var oldpos=parserpos;
      var relop=getChar();
      parserpos++;
      relop=relop+getChar();
      parserpos++;
      if (relop=="==" || relop=="!=" )
      {
        return relop;
      }
      else
      {
        if (relop[0]=="=" || relop[0]=="!")
        {
          parseError("Invalid comparison operator "+relop);
        }
        else {
          parserpos=oldpos;
          return "";
        }
      }
    }

    var parseRelation=function()
    {
      skipSpace();
      var term1=parseSum();
      skipSpace();
      var relop=parseRelationOperator();

      if (relop!="")
      {
        skipSpace();
        var term2=parseSum();
        skipSpace();
        if (relop==">=") return function() {return (term1() >= term2());};
        if (relop==">")  return function() {return (term1() >  term2());};
        if (relop=="<=") return function() {return (term1() <= term2());};
        if (relop=="<")  return function() {return (term1() <  term2());};
      }
      else {
        return term1;
      }
    }

    var parseComparison=function()
    {
      skipSpace();
      var term1=parseRelation();
      skipSpace();
      var relop=parseComparisonOperator();

      if (relop!="")
      {
        skipSpace();
        var term2=parseRelation();
        skipSpace();
        if (relop=="==") return function() {return (term1() == term2());};
        if (relop=="!=") return function() {return (term1() != term2());};
      }
      else {
        return term1;
      }
    }
/*
    var parseLogicalNot=function()
    {
      var fncs=[];
      skipSpace();
      if (getChar()=="!")
      {
        parserpos++
        skipSpace();
        var term=parseRelation();
        skipSpace();
        return function() { return !(term());}
      }
      else {
        return parseRelation();
      }
    }
*/
    var parseLogicalAnd=function()
    {
      var fncs=[];
      skipSpace();
      var term=parseComparison();
      fncs.push({fnc:term});
      skipSpace();

      while(getChar()=="&")
      {
        parserpos++
        if (getChar()=="&")
        {
          parserpos++;
          skipSpace();
          var term=parseComparison();
          fncs.push({fnc:term});
        }
        else
        {
          parseError('Unknown operator &'+getChar());
        }
        skipSpace();
      }
      if (fncs.length==1) return fncs[0].fnc;
      else if (fncs.length==2) return function(){return (fncs[0].fnc() && fncs[1].fnc());};
      else if (fncs.length==3) return function(){return (fncs[0].fnc() && fncs[1].fnc() && fncs[2].fnc());};
      else return function()
      {
        var res=true;
        for(var i=0;i<fncs.length;i++)
        {
          res=res && fncs[i].fnc();
          if (res==false) break;
        }
        return res;
      }
    }

    var parseLogicalOr=function()
    {
      var fncs=[];
      skipSpace();
      var term=parseLogicalAnd();
      fncs.push({fnc:term});
      skipSpace();

      while(getChar()=="|")
      {
        parserpos++
        if (getChar()=="|")
        {
          parserpos++;
          var term=parseLogicalAnd();
          fncs.push({fnc:term});
        }
        else {
          parseError('Unknown operator |'+getChar());
        }
        skipSpace();
      }
      if (fncs.length==1) return fncs[0].fnc;
      else if (fncs.length==2) return function(){return fncs[0].fnc() || fncs[1].fnc();};
      else if (fncs.length==2) return function(){return fncs[0].fnc() || fncs[1].fnc() || fncs[2].fnc();};
      else return function(){
        var res=false;
        for(var i=0;i<fncs.length;i++)
        {
            res=res || fncs[i].fnc();
            if (res==true) break;
        }
        return res;
      }
    }

    var parseExpression=function()
    {
      var fncs=[];
      skipSpace();
      var term=parseLogicalOr();
      fncs.push({fnc:term});
      skipSpace();

      if(getChar()=="?")
      {
        parserpos++
        var thenterm=parseLogicalOr();
        fncs.push({fnc:thenterm});
        skipSpace();
        if(getChar()==":")
        {
          parserpos++
          var elseterm=parseLogicalOr();
          fncs.push({fnc:elseterm});
        }
        else {
          parseError('Missing : of ? operator');
        }
      }
      if (fncs.length==1) return fncs[0].fnc;
      else return function(){
        return (fncs[0].fnc()?fncs[1].fnc():fncs[2].fnc());
      }
    }

    var parseBlock=function() {
      if (getChar()=="{")
      {
        parserpos++;
        var funarray=[];
        skipSpace();
        while (!eof() && getChar()!='}')
        {
          funarray.push(parseStatement());
          skipSpace();
        }
        if (eof())
        {
          parseError('Missing }');
        }
        parserpos++;
        if (funarray.length==1) return funarray[0];
        else
        return function()
        {
          for(var i=0;i<funarray.length;i++)
          {
            funarray[i]();
          }
        };
      }
      else
      {
        parseError('Missing { from block');
      }
    };

    var parseStatement=function() {
      skipSpace();
      if (getChar()==";")
      {
        parserpos++;
        return function(){};
      }

      var pos=parserpos;
      var variablename=parseDesignator();
      skipSpace();
      if (getChar()=="{")
      {
        var blockfun=parseBlock();
        return blockfun;
      }
      else if ((typeof variablename==="string") && variablename=="if" && getChar()=="(")
      {
        parserpos++;
        skipSpace();
        let condition=parseExpression(); // change to condition
        let thenfunc=null;
        let elsefunc=null;
        skipSpace();
        if (getChar()==")")
        {
          parserpos++;
          skipSpace();
          thenfunc=parseStatement();
          skipSpace();
          var elsepos=parserpos;
          var variablename=parseDesignator();
          if ((typeof variablename==="string") && variablename=="else")
          {
            elsefunc=parseStatement();
          }
          else
          {
            parserpos=elsepos;
          }
          return function() {
            if (condition()) {
              thenfunc();
            }
            else
            {
              if (elsefunc!=null) elsefunc();
            }
          }
        }
        else {
          parseError('Missing ) for if condition');
        }
      }
      else if ((typeof variablename==="string") && variablename=="foreach" && getChar()=="(")
      {
        parserpos++;
        skipSpace();
        let itemname=parseIdent();
        skipSpace();
        let instring=parseIdent();
        skipSpace();
        let itemslist=parseExpression();
        skipSpace();
        if (instring==="in" && getChar()==")")
        {
          parserpos++;
          skipSpace();
          let forfunc=parseStatement();
          skipSpace();
          return function()
          {
            var locallist=itemslist();
            var iteratelist=[];            
            if (typeof locallist === "object")
            {
              if (locallist instanceof Array)
              {
                for(var i=0;i<locallist.length;i++)
                {
                  iteratelist.push(locallist[i]);
                }
              } else {
                for (var prop in locallist)
                {
                  iteratelist.push(prop);
                }  
              }
            }
            var stacklocalvar;
            if (context.scriptvars.hasOwnProperty(itemname)) stacklocalvar=context.scriptvars[itemname];
            for(var i=0;i<iteratelist.length;i++)
            {
              context.scriptvars[itemname]=iteratelist[i];
              forfunc();
            }
            if (typeof stacklocalvar!="undefined") context.scriptvars[itemname]=stacklocalvar;
          }
        }
        else
        {
          parseError("Missing ) or invalid for argument");
        }
      }
      else
      {
        skipSpace();
        var op="";
        if (((typeof variablename==="string") || (typeof variablename==="object")) && getChar()=="=")
        {
          op="=";
          parserpos++;
          var expr=parseExpression();
        }
        else if (((typeof variablename==="string") || (typeof variablename==="object")) && getChars(2)=="+=")
        {
          op="+=";
          parserpos+=2;
          var expr=parseExpression();
        }
        else
        {
          op="=";
          variablename="ans";
          parserpos=pos; // set back
          var expr=parseExpression();
        }
        skipSpace();
        if (getChar()!=";")
        {
          parseError("Missing ; at parseStatement");
        }
        parserpos++;
        if (typeof variablename==="string")
        {
          return function(){
            if (context.scriptvars[variablename] && (typeof context.scriptvars[variablename]==="object") && (isSetter(context.scriptvars[variablename],"value")))
            {
              if (op==="=") context.scriptvars[variablename].value=expr();
              if (op==="+=") context.scriptvars[variablename].value+=expr();
            }
            else
            {
              if (op==="=") context.scriptvars[variablename]=expr();
              if (op==="+=") context.scriptvars[variablename]+=expr();
            }
          }
        }
        else if (typeof variablename==="object")
        {
          return function() {
            var prop=variablename[0];
            var v=context.scriptvars;
            var i;
            for(i=0;i<variablename.length;i++)
            {
              var prop=variablename[i];
              if (typeof prop==="function")
              {
                prop=prop();
              }
              if (v.hasOwnProperty(prop) && (typeof v[prop]==="object") && isGetter(v[prop],"value"))
              {
                if(i<variablename.length-1)
                {
                  v=v[prop].value;
                }
                else {
                  if (op==="=") v[prop].value=expr();
                  if (op==="+=") v[prop].value=expr();
                }
              }
              else
              {
                if(i<variablename.length-1)
                {
                  if (v.hasOwnProperty(prop)==false) v[prop]={};
                  v=v[prop];
                } else {
                  if (op==="=") v[prop]=expr();
                  if (op==="+=") v[prop]=expr();
                }
              }
            }
          }
        }
      }

    };

    var parseInstructions=function() {
      var funarray=[];
      skipSpace();
      while (!eof())
      {
        funarray.push(parseStatement());
        skipSpace();
      }
      return function()
      {
        for(var i=0;i<funarray.length;i++)
        {
          funarray[i]();
        }
      };
    }


    try {
      parserpos=0;
      var prog=parseInstructions();
      return function(newcontext)
      {
        context=newcontext || {};
        if (!context.scriptvars)
        {
          context.scriptvars={};
        }
        prog();
        return context;
      }
    }
    catch(err)
    {
      var linenumber=1;
      var source=parserstring.substring(0,parserpos);
      source=source.replace("\r\n"," \n");
      source=source.replace("\r","\n");
      for(var i=0;i<source.length;i++)
      {
        if(source[i]=="\n") linenumber++;
      }
      return "Error: "+err.name+" at line "+linenumber;
    }
  };
  return {compile: compile}
};

module.exports = thingscript();
