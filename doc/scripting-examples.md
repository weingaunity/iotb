# Script Examples

## Simple generic Ram Variable dispatcher
``` javascript
// write a value to variable temperatur:
//    <server>/thing/<thingname>/temperatur?value=20
// read a value from variable
//    <server>/thing/<thingname>/temperatur

if (action=="http")
{
  x=ramVar(name,0);
  if (defined(value)) x=value;
  res=x;    
}
```

## Access other thing
### Script of thing1
``` javascript
if (action=="http")
{
  y=thingVar("thing2","y","mykey1"); // thing1 owner = mykey1 owner
  z=thingVar("thing2","z","mykey2:key2token"); // thing1 owner != mykey2 owner
  if (name=="x" && defined(value))
  {
    y=value;
    res=z;
  }
}
```
### Script of thing2
``` javascript
x=ramVar("x",0);
if (action=="thing")
{
  if (name=="y" && usedKey("mykey1") && defined(value)) x=2*value;
  if (name=="z" && usedKey("mykey2")) res=x;
}
```


## Simple access restriction using different keys
``` javascript
// key1 is allowed to write x but not to read x.
// key2 is allowed to read x but not to write x.
// <server>/thing/testthing/x?value=123&keytoken=mykey1:verysecrettoken
x=ramVar("x",0);
if (action=="http")
{
  res="access denied!";
  if (usedKey("mykey1") && name=="x" && defined(value))
  {
    x=value;
    res="done!!!";
  }
  if (usedKey("mykey2") && name=="x")
     res=x;
}
```


## Simple periodic task example
``` javascript
// read counter value:
//    <server>/thing/<thingname>/counter

counter=ramVar("counter",0); // 0 is default value
if (action=="http")
{
  if (name=="counter") res=counter;
}
else if (action=="init")
{
  timeout=1; // run next tick event in 1 second
  counter=1000; // set start value
}
else if (action=="tick")
{
  timeout=1; // run next tick event in 1 second
  counter=counter+1; // increment counter value
}
```

## Numbers and Strings
``` javascript
if (action=="http" && defined(value))
{
  // input variable "value" parsed as JSON
  if (name=="number1" )
    res=value*3.14159;
  // round to 3 digits
  if (name=="number2" )
    res=Number(value*3.14159,3);
  if (name=="text1")
    res=subString("Hallo",1,2);
  if (name=="text2")
    res=subStringBefore("Hallo:123",":");
  if (name=="text3")
    res=subStringAfter("Hallo:123",":");
}
```

## Using current timestamp
``` javascript
// read variables with following command:
//    <server>/thing/<thingname>/<name>
inittimestamp_ms=ramVar("inittimestamp_ms",0);
if (action=="init")
{
  inittimestamp_ms=Number(now("%unixtime")); // get unix time in ms and save it
}
else if (action=="http")
{
  if (name=="inittimestamp") res=inittimestamp_ms;
  if (name=="iso")           res=now("%iso");
  if (name=="time")          res=now("%hh:%mm:%ss..%ms  = %time_min minutes = %time_sec seconds = %time_ms milli seconds");
  if (name=="date")          res=now("%YYYY.%MM.%DD");
}
```

## Save and load from Database
``` javascript
// here a simple counter thing
counters=ramVar("counters",{asd:2123});

if (method=="init")
{
  // during init the db variable
  // contains the complete database variables
  // all database variables are loaded into the ram
  if (defined(db.counters))
  {
    counters=db.counters;
  }
}

if (action=="http")
{
  if (defined(value))
  {
    if (name=="count")
    {
      if (!defined(counters[value])) counters[value]=0;
      counters[value]=counters[value]+1;
      // write the changed ram variable back to the database
      writeDB("counters",counters);
    }
    if (name=="get")
    {
      res=-1;
      if (defined(counters[value])) res=counters[value];
    }
  }
}
```

## Task Scheduler
``` javascript
weekdays_mo_fr="mo,di,mi,do,fr";
weekdays_mo_so="mo,di,mi,do,fr,sa,so";
tasks=ramVar("tasks",{
  task1:
  [
    {weekdays:weekdays_mo_fr,timestamp:"07:20:00"},
    {weekdays:weekdays_mo_fr,timestamp:"08:15:30"}
  ],
  task2:
  [
    {weekdays:weekdays_mo_so,timestamp:"04:00:00"},
    {weekdays:weekdays_mo_fr,timestamp:"07:24:00"},
    {weekdays:weekdays_mo_fr,timestamp:"08:18:00"},
    {weekdays:weekdays_mo_so,timestamp:"09:00:00"}
  ]
});

mo_so=["mo","di","mi","do","fr","sa","so"];
time={
  utc:now(),
  hh:Number(now("%hh")),
  mm:Number(now("%mm")),
  ss:Number(now("%ss")),
  ms:Number(now("%ms")),
  WD:Number(now("%WD")),
  WDname:mo_so[Number(now("%WD"))-1],
  DD:Number(now("%DD")),
  MM:Number(now("%MM")),
  YYYY:Number(now("%YYYY")),
  unix:unixtime,
  localdatetime:now("%YYYY-%MM-%DDT%hh:%mm:%ss.%msZ"),
  localdatetime_sec:now("%YYYY-%MM-%DDT%hh:%mm:%ss"),
  localtime_sec:now("%hh:%mm:%ss"),
  localdate:now("%YYYY-%MM-%DD"),
  localtime_sec:now("%hh:%mm:%ss"),
  offset:unixtime(now("%YYYY-%MM-%DDT%hh:%mm:%ss.%msZ"))-unixtime
};

ram=ramVar("ram",{
  lasttimestamp:"",
  logs:[]
});


if (action=="init")
{
  timeout=0.1;
}
if(action=="tick")
{
  timeout=0.25;
  exectask=[];
  if (ram.lasttimestamp!=time.localtime_sec)
  {
    ram.lasttimestamp=time.localtime_sec;
    // newsec reached
    foreach(taskname in tasks)
    {
      task=tasks[taskname];
      exec=false;
      foreach(timestamp in task)
      {
        timestampmatched=true;
        idxl=[0,1,3,4,6,7];
        if (defined(timestamp.timestamp))
        {
          foreach(idx in idxl)
          {
            _ca=subString(timestamp.timestamp,idx,1);
            _cb=subString(time.localtime_sec,idx,1);
            if (_ca=="X" || (_ca==_cb))
            {
              
            }
            else
            {
              timestampmatched=false;
            }
          }
        }
        
        if (defined(timestamp.weekdays) && defined(timestamp.timestamp))
        {
          if (containsString(timestamp.weekdays,time.WDname) && timestampmatched==true)
          {
            exec=true;
          }
        }
      }
      if (exec==true) pushArray(exectask,taskname);
    }
  }
  
  foreach(task in exectask)
  {
    logentry=[time.localdatetime,task];
    if (task=="task1")
    {
      // do task 1 things
    }
    if (task=="task2")
    {
      // do task 2 things
    }
    unshiftArray(ram.logs,logentry); // add execution to the top of logs
  }
  if (ram.logs.length>20) popArray(ramlogs); // delete old logs
}
```

## Make HTTP-Requests
``` javascript
ram=ramVar("ram",{});

foreach(e in events)
{
  if (e.id=="init")
  {
    ram.debug=e.json;
    ram.debug2=e.body;
  }
}

if (action=="init")
{
  ram={counter:0};
  // make a http POST Request
  // each response is stored as event within the events-array
  // next time, when the thing was triggered (tick, http, thing)
  // check the events array with a foreach (see at the top)
  // eventid can be an object too
  httpRequest("POST","https://webhook.site/.....",{
    jsonbody:{counter:321,ab:"asdfdef",c:[1,2,3]},
    query:{a:123,b:"asdf",c:toJson({g:213,ewr:[1,2,3]})},
    eventid:"init"
  });
  timeout=0.1;
}

if (action=="tick")
{
  ram.counter=ram.counter+1;
  timeout=1;
}
```


## Improved Variable Service with HTTP and WebSockets

Examples: Set a variable __sensor1__ to 123. Value has to be a valid JSON. So it could be a complex datastructure too.
```text
   http(s)://iotbroker/thing/<thingname>/sensor1?value=123
```

Examples: Get the content of variable __sensor1__
```text
   http(s)://iotbroker/thing/<thingname>/sensor1
```

This could be done with websockets too. Every websocket message to the variable is forwarded to all other websockets (except the source socket).
This also happens if a http request writes to the variable.
```text
  ws://iotbroker/thing/<thingname>/sensor1
```

The thing-script:
``` javascript
ram=ramVar("___debug",{});
if (action=="http" || action=="thing")
{
  x=ramVar(name,0);
  ram.test=value;
  if (defined(valueraw)) x=valueraw;
  if (defined(value))
  {
    x=value;
    ids=getWebSocketIDs();
    tags=[];
    foreach(id in ids)
    {
      pushArray(tags,[name+"_"+id]);
    }
    sendWebSocket(value,tags);
  }
  res=x;
}
if (action=="websocket")
{
  if (defined(value))
  {
    x=ramVar(name,0);    
    x=value;
    ids=getWebSocketIDs();
    removeFromArray(ids,getWebSocketID());
    tags=[];
    foreach(id in ids)
    {
      pushArray(tags,[name+"_"+id]);
    }
    sendWebSocket(value,tags);
  }
  else
  {
    setWebSocketTags([name+"_"+getWebSocketID()]);
  }
}
```