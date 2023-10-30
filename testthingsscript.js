var thingscriptcompiler=require('./thingscript.js');

var scriptfunctions={
  print: function(ctx, args) {
    ctx.console+=args[0]()+"\n";
    if (ctx.run==0) console.log(args[0]());
    return 0;
  },
  logicLevel: function(ctx, args) {
    return (args[0]()>0.5)?true:false;
  },
  ramVar: function(ctx, args)
  {
    var obj={
        get value()
        {
            return null;
        },
        set value(val)
        {
        }
    };
    if (!ctx.hasOwnProperty("ramvars")) ctx.ramvars={};
    if (args.length==1 || args.length==2)
    {
      var defaultvalue=0;
      if (args.length==2 && typeof(args[1])==="function") defaultvalue=args[1]();
      ctx.ramvars[args[0]()]=defaultvalue;
      var obj={
        get value()
        {
            return ctx.ramvars[args[0]()];
        },
        set value(val)
        {
            ctx.ramvars[args[0]()]=val;
        }
      };
    }
    return obj;
  },
  ramLog: function(ctx, args)
  {
    var container={};
    container.history=[];
    container.maxlength=100;
    if (args.length==1)
    {
      container.maxlength==args[0]();
    }
    var obj={
      get average()
      {
        var res=0;
        for(var i=0;i<container.history.length;i++)
        {
          res+=container.history[i];
        }
        return res/container.history.length;
      },
      get current()
      {
        return container.history[container.history.length-1];
      },
      get length()
      {
        return container.history.length;
      },
      set log(val)
      {
        container.history.push(val);
        while(container.history.length>container.maxlength) container.history.shift();
      }
    };
    return obj;
  }
};

var scriptoptions={
  functions: scriptfunctions,
};

var program="";
program+='x=5;y=2;if( 4 > 5 ){z=3;}else if(4>4){z=4; f=print("Hallo");} else {z=5.6;}\n';
program+='if( (7*3) == 1) print("FAILED");else print("PASSED");\n';
program+='if( (true && false) == false) print("PASSED");else print("FAILED");\n';
program+='if( (true && true) == true) print("PASSED");else print("FAILED");\n';
program+='if( (true && false && true) == false) print("PASSED");else print("FAILED");\n';
program+='if( (true && false && true) == true) print("FAILED");else print("PASSED");\n';
program+='if( (false || false || true) == true) print("PASSED");else print("FAILED");\n';
program+='if( (5>3) == true) print("PASSED");else print("FAILED");\n';
program+='if( (5>=3) == true) print("PASSED");else print("FAILED");\n';
program+='if( (5<=3) == false) print("PASSED");else print("FAILED");\n';
program+='if( (5<3) == false) print("PASSED");else print("FAILED");\n';
program+='if( (3<=5) == true) print("PASSED");else print("FAILED");\n';
program+='if( (3<5) == true) print("PASSED");else print("FAILED");\n';
program+='if( (4==5) == false) print("PASSED");else print("FAILED");\n';
program+='if( (4!=5) == true) print("PASSED");else print("FAILED");\n';
program+='if( !(4!=5) == false) print("PASSED");else print("FAILED");\n';
program+='if( (4!=4) == false) print("PASSED");else print("FAILED");\n';
program+='if(logicLevel(4)) print("PASSED");else print("FAILED");\n'
program+='if((4>3) && logicLevel(4)) print("PASSED");else print("FAILED");\n'
program+='if(!((4>3) && logicLevel(4))) print("FAILED");else print("PASSED");\n'
program+='if(length("Hallo")==5) print("PASSED");else print("FAILED");\n'
program+='if(length("Hallo123")==8) print("PASSED");else print("FAILED");\n'
program+='s1=sliceString("Hallo",3);\n';
program+='s2=sliceString("Hallo",-3);\n';
program+='if(s1=="Hal") print("PASSED");else print("FAILED");\n'
program+='if(s2=="llo") print("PASSED");else print("FAILED");\n'
program+='if(replaceString("Hallo","all","xyz")=="Hxyzo") print("PASSED");else print("FAILED");\n'
program+='if(log10(100)==2) print("PASSED");else print("FAILED");\n'
program+='testvar=32;\n';
program+='num1=-33;\n';
program+='num2=-1.23456e2;\n';
program+='num3=-1.23456e-1;\n';
program+='if(exists("testvar")) print("PASSED");else print("FAILED");\n'
program+='if(exists("testvar1")) print("FAILED");else print("PASSED");\n'
program+='if(defined(testvar)) print("PASSED");else print("FAILED");\n'
program+='if(defined(testvar1)) print("FAILED");else print("PASSED");\n'
program+='if(containsString("Hallo","all")) print("PASSED");else print("FAILED");\n'
program+='if(containsString("Hallo","alL")) print("FAILED");else print("PASSED");\n'
program+='print((5>3)?"PASSED A":"FAILED");\n';
program+='print((2<1)?"FAILED":"PASSED B");\n';
program+='obj1={};\nobj1.x=5;\nobj1.y="hallo";\nobj1.z={};\nobj1.z.x=obj1.x+1;\nif(obj1.z.x==6) print("PASSED"); else print("FAILED");\n';
program+='if(obj1["z"].x==6) print("PASSEDarray"); else print("FAILEDarray");\n';
program+='if(obj1["z"]["x"]==6) print("PASSEDarray"); else print("FAILEDarray");\n';
program+='if(obj1[["z","x"]]==6) print("PASSEDarray"); else print("FAILEDarray");\n';
program+='obj1.a.b.c.d=123;\nif(obj1[["a","b"]].c["d"]==123) print("PASSEDarray"); else print("FAILEDarray");\n';
program+='if(defined(obj1[["a","b"]].c["d"])) print("PASSEDarray"); else print("FAILEDarray");\n';
program+='if(defined(obj1[["a","b"]].c["e"])) print("FAILEDarray"); else print("PASSEDarray");\n';
program+='if(defined(obj1.z.x)) print("PASSED"); else print("FAILED");\n';
program+='if(!defined(obj1.z.y)) print("PASSED"); else print("FAILED");\n';
program+='obj2={};obj2.x=ramVar("hallo",5); obj2.x=8; obj2.y=obj2.x+2;print("PASSED");\n';
program+='temp=ramLog(); temp.log=5; temp.log=4; temp.log=3; temp.log=3;\n';
program+='if(temp.length==4) print("PASSED"); else print("FAILED");\n';
program+='if(temp.average==3.75) print("PASSED"); else print("FAILED");\n';
program+='obj3={x:3, y:7 ,z:{a:"Hallo",b:4.23 }}; obj3.sum=obj3.x+obj3.y;\n';
program+='obj4=[1,2,3,{x:3,y:[5,4,"asd"]}];\n';
program+='obj5=ramVar("hallo",{x:3000,y:321,z:[1,2,3]});\n';
program+='obj5.summe=obj5.x+obj5.y; if(obj5.summe==3321) print("PASSED"); else print("FAILED");\n'
program+='nowunix=unixtime();\n'
program+="unix2=unixtime(2018,6,18,19,21,0,0);\n"
program+="delta=nowunix-unix2;"
program+="foreach(x in [1,2,3]) {print(x);}";
program+='foreach(x in [{name: "Var", value: 1234},{name: "XY", value: 1234}]) {print(x.name+" = "+x.value);}';
program+='names=splitString("Klaus, Michi, Hallo",", ");';
program+='foreach(name in names) print(name);';
program+='addtest1="Hallo"; addtest1+=" Du";';
program+='addtest2=3.2; addtest2=4.44;';
program+='if((5*3%4*2)==6) print("PASSED"); else print("FAILED");'
program+='if((((5*3)%4)*2)==6) print("PASSED"); else print("FAILED");'
program+='if(((5*3)%(4*2))==7) print("PASSED"); else print("FAILED");'
program+='if((5*(3%4)*2)==30) print("PASSED"); else print("FAILED");'
program+='randoms=[];';
program+='foreach(x in [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]) {pushArray(randoms,random(5,12));}';
program+="obj6={x:3,y:1,z:['abc','def','ghi'],};\n";
program+="print(obj6['z'][2]);print('Laenge: '+length(obj5.z));\n";
program+="obj7.a.b.c.d.e.f.g=1234;print(obj7);\n";
program+="if(defined(obj7.a)) print('PASSED'); else print('FAILED');\n";
program+="if(defined(obj7.b)) print('FAILED'); else print('PASSED');\n";
program+="lftest1=+3*-2; if (lftest1==-6) print('PASSED'); else print('FAILED');\n"
program+="lftest2=3+-7; if (lftest2==-4) print('PASSED'); else print('FAILED');\n"
program+="if(!(3>1)) print('FAILED'); else print('PASSED');\n"
program+="if(3>5==7>10) print('PASSED'); else print('FAILED');\n"
program+="xsinus=3.14159/2;if(3*sin(xsinus)>2.99) print('PASSED4'); else print('FAILED');\n"
program+="lftest3=-(4.3)+ - -(4.3);\n";
program+="lftest4=!(4>3);\n";
program+="stringtest1='Hallo '+'Du';if(stringtest1=='Hallo Du') print('PASSED'); else print('FAILED');\n";
program+="replstring1=replaceStringAt('Hallo du Da!',2,'ppy');\n";
program+="replstring2=replaceStringAt('12345',3,'defgh');\n";
program+="replstring3=replaceStringAt('12345',20,'defgh');\n";
program+="replstring4=replaceStringAt('12345',-2,'defgh');\n";
program+="if (replstring1=='Happy du Da!') print('PASSED'); else print('FAILED');\n";
program+="if (replstring2=='123de') print('PASSED'); else print('FAILED');\n";
program+="if (replstring3=='12345') print('PASSED'); else print('FAILED');\n";
program+="if (replstring4=='fgh45') print('PASSED'); else print('FAILED');\n";
program+="if (toUpperCase('AbcDe')=='ABCDE') print('PASSED'); else print('FAILED');\n";
program+="if (toLowerCase('AbcDe')=='abcde') print('PASSED'); else print('FAILED');\n";
program+="array1=[1,2,3,4,5];\n";
program+="print('===== Array Tests ======');\n";
program+="insertArrayAt(array1,-1,6);\n";
program+="insertArrayAt(array1,-1,7);\n";
program+="insertArrayAt(array1,-2,6.5);\n";
program+="insertArrayAt(array1,0,0);\n";
program+="insertArrayAt(array1,2,1.5);\n";
program+="insertArrayAt(array1,-1,8);\n";
program+="replaceArrayAt(array1,-3,7.1);\n";
program+="insertArrayAt(array1,-3,7);\n";
program+="replaceArrayAt(array1,0,0.1);\n";
program+="replaceArrayAt(array1,4,3.3);\n";
program+="if (removeArrayAt(array1,0)==0.1) print('PASSED'); else print('FAILED');\n";
program+="if (removeArrayAt(array1,-2)==8) print('PASSED'); else print('FAILED');\n";
program+="if (removeArrayAt(array1,1)==1.5) print('PASSED'); else print('FAILED');\n";
program+="if (removeArrayAt(array1,-4)==6.5) print('PASSED'); else print('FAILED');\n";
program+="if (removeFromArray(array1,7)==true) print('PASSED'); else print('FAILED');\n";
program+="array_obj1={name:'obj1',value:123};\n";
program+="array_obj2={name:'obj2',value:123456};\n";
program+="array2=[array_obj1,array_obj2];\n";
program+="if (removeFromArray(array2,array_obj1)==true) print('PASSED'); else print('FAILED');\n";
program+="if (removeFromArray(array2,array_obj1)==false) print('PASSED'); else print('FAILED');\n";
program+="if (removeFromArray(array2,array_obj2)==true) print('PASSED'); else print('FAILED');\n";
program+="jsonobj1={a:1,b:'asd'};jsonstr=toJson(jsonobj1);jsonobj2=fromJson(jsonstr);\n";
program+="if ((jsonobj2.a==1)&&(jsonobj2.b=='asd')) print('PASSED JSON'); else print('FAILED');\n";
program+="b64array1=[4,5,6,7];b64str=toBase64(b64array1);b64array2=fromBase64(b64str1);\n";
program+="print(b64array1);\n";
program+="print(b64str);\n";
program+="print(b64array2);\n";
program+="objiterate={a:1,b:2,c:3};\n";
program+="foreach(i in objiterate) print(i);\n";
program+="print(unixtime());\n";
program+="print((unixtime2string(1583691587135,'%YYYY%MM%DD-%hh:%mm')=='20200308-19:19')?'PASSED':'FAILED');\n";
program+="print((unixtime2string(1583691587135+24*60*60*1000,'%YYYY%MM%DD-%hh:%mm')=='20200309-19:19')?'PASSED':'FAILED');\n";
program+="print(meanFromArray([]));\n"
program+="print(meanFromArray([1,'2',2,3,10.2]));\n"
program+="print(medianFromArray([]));\n"
program+="print(medianFromArray([1,'3',10,2,2]));\n"
program+="print(medianFromArray([1,'2',2,3,10,10.2]));\n"
program+="x=fromJson('{\"y\":null,\"z\":1}');\n";
program+="print(x);\n";
program+="print((x.y==null)?'PASSED':'FAILED');\n";
program+="print((x.z!=null)?'PASSED':'FAILED');\n";
program+="x.z=null;\n";
program+="print((x.z==null)?'PASSED':'FAILED');\n";

var fun=thingscriptcompiler.compile(program,scriptoptions);
var perftest=function(count){
  console.log("##############################################");
  console.log("##############################################");
  console.log("##############################################");
  for(var i=count-1;i>=0;i--)
  {
    var context={run:i,console:""};
    var ctx=fun(context);
    if (i==0)
    {
      console.timeEnd("performance"); console.log("For "+count+" runs!"); // console.log(ctx);
      if (context.console.includes("FAILED"))
      {
        console.log("Test FAILED!!!!!!!!!!!");
      }
      else
      {
        console.log("Test PASSED!!!!!!!!!!!");
      }
    }
  }
};

if (typeof fun == "function")
{
  console.time("performance");
  perftest(100);
}
else if (typeof fun == "string")
{
  console.log(fun);
}
else {
  console.log("Compile Issue!!!!!");
}
