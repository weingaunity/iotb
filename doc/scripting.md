# Scripting the things

Each thing has it's own script. The script is executed with following triggers:
 * http GET request

   The value and keytoken passed as query string are optional.
```
<server>/thing/<thingname>/<name>?value=<value>&keytoken=<key:token>
```


  * called by an other thing
  * initialization of the thing at server start or when the thing
    was modified
  * timeout tick


## Input variables that are provided when the script starts

```
thingname      = < name of the current thing >
action         = < "http" | "init" | "tick" | "thing" | "broker">
name           = < name passed by http request or call by thing >
value          = < value passed to the variable >
from           = < caller thingname when caller is a thing >
unixtime       = < value with the current unix time >
sessionuser    = < current logged in iotbroker user name, http action only >
clientipaddr   = < ip address of the client, maybe a list of ip's in case of proxies, http action only >
db             = < container with the thing database variables. init action only! >
```

## Output variables that are used after script ends

```
res   = < default: "done", the content is returned to http response or caller thing >
timeout     = < used from init or tick caller to plan next tick event in seconds. value 0 deactivates tick calls >
```

## Control Structures

```javascript
if (condition1) {

}  else if (condition2) {

}
else
{

}
```

```javascript
foreach(itemvariable in arrayvariable) {
  // iterates through array elements that were
  // stored within the array at foreach start
  // modifications of the array within the foreach
  // does not effect the iteration process
  // each element is stored within itemvariable

}
```

```javascript
foreach(propname in object) {
  // iterates through object properties
  // each property name is stored within propname

}
```

## Datatypes
Datatype | Description
---------- | -------------
true, false | Values for boolean variables.
"hello" | A string
'"hello"' | A string that contains double quotes
"'hello'" | A string that contains single quotes
null | null value
NaN | not a number
123, 1.234, 1.12e4, 1.23e-3 | A floating point and integer numbers
{x:1, y:[1,2,3]} or {x:1,y:2,} | An object with an array for a property.
[1,2,3,"assd"] or [1,2,3,] | An array with mixed typed elements.

```javascript
x={a:1,b:{c:1, d:2}};
y1=x.b.c;
y2=x["b"].c;
y3=x[["b","c"]];
```

## Operators

Operator | Description
---------- | -------------
a > b | Returns true if a greater than b
a >= b | Returns true if a greater equal than b
a < b | Returns true if a less than b
a <= b | Returns true if a less equal than b
a == b | Returns true if a equal b
a != b | Returns true if a not equal b
a && b | Logical AND
!a     | Logical NOT
a &#124;&#124; b | Logical OR
a + b | Add numbers or concat strings
a - b | Subtract numbers
a * b | Multiply numbers
a / b | Divide numbers
a % b | Modulus operator returns the division remainder.
(condition)?a:b | If condition is true, the value a is used, otherwise b.



## Script Functions - Broker

Function | Description
---------- | -------------
__ramVar__(_varname_[,_defaultvalue_]) | Create an access variable for a persistent ram variable linked to the current thing. This ram variable is deleted when the thing restarts in case of a change or a server restart.
__thingVar__(_thingname_,_name_[,_token_]) | Create an access variable for a remote thing.
__callThing__(_thingname_,_name_[,_value_]) | Call thing
__callThingWithKey__(_thingname_,_name_,_key_[,_token_]) | Call thing with key
__webPush__(_topic_,_message_) | _message_ can be a string or an object with the members _title_, _message_ and optional _icon_
__writeDB__(_name_,_variable_) | Stores the content of _variable_ into the thing database with the name _name_. During "init" this value is available with db._name_.
__getBrokerStatistics__() | Get copy of current broker statistics object.
__isAdmin__(_username_) | Returns true, if the user exists and is admin.
__isUser__(_username_) | Returns true, if the user exists.
__exists__("_varname_") | check if variable with _varname_ exists within context.
__defined__(_varname_) | check if variable with _varname_ is defined (exists) within context.
__isValue__() | Check if value is passed to the script. value is a scriptvariable too.
__isKeyToken__() | Check if keytoken is passed via query. keytoken is not a scriptvariable.
__usedKey__(_keyname_ or _arrayofkeynames_) | Checks if request uses a valid keytoken pair that match the passed _keyname_ or is within the _arrayofkeynames_ list.

## Script Functions - Data Conversion

Function | Description
---------- | -------------
__Number__(_value_[,_precision_]) | Convert a string or number to a number and round to a given number of decimals.
__hex2dec__(_hexstring_) | Converts a string with a hex number to an integer number
__dec2hex__(_number_) | Converts an integer (string) to a lower case hex string
__dec2HEX__(_number_) | Converts an integer (string) to an upper case hex string
__toJson__(_object_) | returns the json-string of the passed object
__fromJson__(_jsonstring_) | converts the passed json-string into an object

## Script Functions - String and Array

Function | Description
---------- | -------------
__length__(_string/array_) | Returns the length of a string, an array or the number of object properties
__sliceString__(_string_,_n_) | When _n_>0 the function extracts the first _n_ characters of the _string_. When _n_<0 the function extracts the last _n_ characters of the _string_.
__subString__(_string_,_start_,_length_) | ...
__subStringBefore__(_string_,_splitstring_) | ...
__subStringAfter__(_string_,_splitstring_) | ...
__replaceString__(_string_,_oldstring_,_newstring_) | ...
__replaceStringAt__(_string_,_index_,_newstring_) | ...
__containsString__(_string_,_substring_) | returns true or false
__splitString__(_string_,_splitstring_) | splits a string at the specified _splitstring_ and returns an array
__toUpperCase__(_string_) | ...
__toLowerCase__(_string_) | ...
__pushArray__(_array_,_element_) | Append an element at the end of an array.
__popArray__(_array_) | Removes and returns the last element of an array.
__shiftArray__(_array_) | Removes and returns the first element of an array.
__unshiftArray__(_array_,_element_) | Append an element at the begin of an array.
__insertArrayAt__(_array_,_index_,_element_) | Inserts an element at the given index. If index -1 selects the end of the array. -2 the last element, -3 the element befor the last element, ... .
__replaceArrayAt__(_array_,_index_,_element_) | Replace an element at the given index. Index -2 selects the last element, -3 the element befor the last element, ... . The old element  is returned.
__removeArrayAt__(_array_,_index_) | Remove an element at the given index. Index -2 selects the last element, -3 the element befor the last element, ... . The removed element is returned.
__removeFromArray__(_array_,_object_) | Removes the _object_ instance from _array_ if exists and returns true if found and removed. Otherwise false.
__toBase64__(_array_) | Converts an array of integers (bytes) to a base64 string.
__fromBase64__(_array_) | Converts an array of integers (bytes) to a base64 string.

## Script Functions - Math

Math-Function | Description
---------- | -------------
__PI__() | Returns the number Pi
__E__() | Returns the euler number
__abs__(_x_) | ...
__acos__(_x_) | ...
__acosh__(_x_) | ...
__asin__(_x_) | ...
__asinh__(_x_) | ...
__atan__(_x_) | ...
__atan2__(_y_,_x_) | ...
__cbrt__(_x_) | ...
__ceil__(_x_) | ...
__cos__(_x_) | ...
__cosh__(_x_) | ...
__exp__(_x_) | ...
__floor__(_x_) | ...
__ln__(_x_) | ...
__log__(_x_) | ...
__log10__(_x_) | ...
__max__(_a_,_b_,_c_,...) | ...
__min__(_a_,_b_,_c_,...) | ...
__pow__(_x_,_y_) | ...
__random__() | returns a random number from 0 (inclusive) and 1 (exclusive).
__random__(_a_, _b_) | returns an integer number between _a_ (inclusive) and _b_ (inclusive).
__round__(_x_) | ...
__sin__(_x_) | ...
__sinh__(_x_) | ...
__sqrt__(_x_) | ...
__tan__(_x_) | ...
__tanh__(_x_) | ...
__trunc__(_x_) | ...

## Script Functions - Filters, Signalprocessing

Function | Description
---------- | -------------
__meanFromArray__(_array_) | ...
__medianFromArray__(_array_) | ...
__maxFromArray__(_array_) | ...
__minFromArray__(_array_) | ...

## Script Functions - Date and Time

Math-Function | Description
---------- | -------------
__now__(_string_) | Replaces special placeholder with the current timestamp formated in different ways.
__now__() | returns iso string of current timestamp
__unixtime__(_stringformat_) |  ...
__unixtime__(_year_,_month_,<br/>_day_,_hours_,_minutes_,_seconds_<br/>,_milliseconds_) | ...


now - Placeholder | Description
---------- | -------------
%unixtime | Current timestamp in millisecond since 1.1.1970 00:00
%YYYY | Current year as string (e.g. 2018)
%MM | Current month with leading zeros as string (e.g. 04 for april)
%DD | Current date with leading zeros as string (e.g. 09)
%WD | Current day of the week (1 Monday, ..., 7 Sunday)
%hh | Current hour with leading zeros as string (e.g. 09)
%mm | Current minutes with leading zeros as string (e.g. 09)
%ss | Current seconds with leading zeros as string (e.g. 09)
%ms | Current milliseconds with leading zeros as string (e.g. 017)
%time_min | The time elapsed this day in minutes
%time_sec | The time elapsed this day in seconds
%time_ms  | The time elapsed this day in milliseconds
%iso     | Get iso coded timestamp "2018-04-09T05:54:09.241Z"
