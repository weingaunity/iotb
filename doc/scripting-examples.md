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
