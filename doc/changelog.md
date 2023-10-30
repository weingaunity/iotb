# Change Log
### !!! Do not use varname, method and result any more !!!
Instead use _name_, _action_, _res_

## work
 * Issue: fetch canceled no resource with given identifier found
 * Todo: formating unixtime number
 * Todo: Admin features: get user list, thing statistics (calls, ram and db requirements, bandwidth)
 * Todo: http description and examples
 * Todo: more examples
 * Idea: 2 stage requests (e.g. db requests)
 * Todo: deinit event
 * Todo: FNN Layer + Activation Functions

## 20231030
 * New: Admin could login as other user with admin password. Username: adminname/username  Password: adminpassword
 * New: __toBase64__, __fromBase64__

## 20230516
 * Fixed: Unique-Key Issue at DB-Variables
 * New: Variable keyname now passed, if API-key was used
 * Cookies from HTTP Response
 * New: action "broker" for brokersettings call
 * New: admin can login as other user with following login entry: username:"adminname/username" and pwd:"adminpassword"


## 20220807
 * New functions: __meanFromArray__, __medianFromArray__, __maxFromArray__, __minFromArray__
 * New constants: __null__, __NaN__

## 20191028
  * Fixed: error when passing value to __callThing__
  * New: Functions: __toJson__, __fromJson__,  __getBrokerStatistics__, __toUpperCase__, __toLowerCase__, __isAdmin__, __isUser__
  * Modification: thing brokersettings can be used to configure favorite page and short links
  * New: API to get thing owner to contact them /query/thing/:thingname/owners
  * valueraw, value only available, if valid json
  * Fixed: replaceString
  * Changed: length method returns number of object properties
  * Changed: ramVar default behaviour changed. The default value is stored now directly to the variable at the first time.
  * Changed: httpRequest() request-body can be added now with jsonbody or body at the options.
  * Added: Two examples added to scripting-examples
  

Missing: Objekte kopieren mit default Abbild und Range Checker usw...

## 20180223
  * New: object members can be indexed with an array of names. E.g.: a.b.c is equal a[["b","c"]]
  * New: __removeFromArray__
  * New: __foreach__ can iterate through object property names
  * New: __webPush__ feature added
  * New: __callThing__ and __callThingWithKey__
  * New: IP-Address of the client is avaiable during a http-action. Variablename: _clientipaddr_
  * New: Current logged in user is now available within the script with the variable name _sessionuser_.
  * Fixed: __foreach__ uses list elements that exists before foreach executed. Modification of the list during iteration does not effect the iteration process.
  * Fixed: website/<name>/ redirects to website/<name>/index.html now.
  * Fixed: Finished all string escape sequences: \",  \', \b, \f, \n, \r, \t, \v
  * Modification: usedKey() now accepts a single key name string or an array of key names. If one passed key is one in the list, the function returns true.
  * Modification: Invalid formated JSON strings for the API-value are checked and reported to the client.


## 20180705 (Version 18.07.02)
  * Modification for the npm-package. The default settings can be configured within the package.json file.
  * Installation manual added to the readme.

## 20180702
  * Added
    - Variable _thingname_ contains current thing name
    - Objects with subproperties can be created directly a.b.c.d=4;
    - Indexing arrays and properties is possible now. a=[1,2,3,4]; a[2]
  * Changes
    - thingVar() makes a JSON copy, not a reference
    - _varname_ renamed to _name_, _method_ renamed to _action_, _result_ renamed to _res_
    - Float numbers can be written in the scientific way (e.g. 1.23e4).
    - Last element of objects an lists can have a semicolon. (e.g. [1,2,3,])
    - changelog is shown at page startup
  * Debrecated
    - Do not use _varname_ and _name_ any more!!!

## 20180624
  * Added following functions
    - foreach(x in array) ...
    - arrays supported
    - objects can be created x={a:4, b:3}
    - random() added
    - modulus operator %
    - defined(variable) added

  * Fixes:
    - issue witn %MM in now() function fixed.
    - Improvement of exists() with variables removed. exists("variablename") is required again.

## 20180603
  * Added following functions
    - !a
    - length()
    - replaceString()
    - containsString()
    - dex2hex()
    - dex2HEX()
    - hex2dec()

    - PI()
    - E()
    - abs()
    - acos()
    - acosh()
    - asin()
    - asinh()
    - atan()
    - atan2()
    - cbrt()
    - ceil()
    - cos()
    - cosh()
    - exp()
    - floor()
    - ln()
    - log()
    - log10()
    - max()
    - min()
    - pow()
    - round()
    - sin()
    - sinh()
    - sqrt()
    - tan()
    - tanh()
    - trunc()
  * Fixed: sliceString(n) positive n
  * Improved: exists(), now the variable or a string with the variablename can be passed



## 20180409
  * Scripting documentation improved.
  * now() function provides %WD placeholder to get the day of a week (1..7)
  * Function sliceString added.
## 20180331
  * Login input improved. <Enter> can be used to sign in and the username and password can be stored by the browser now.
  * User button menu improved. The user profile can be opened now.
## 20180312
  * IoT Broker online
  * Documentation improved
  * Added following functions
    - exists()
    - usedKey()
    - subString()
    - subStringBefore()
    - subStringAfter()
    - Number()
    - thingVar()
