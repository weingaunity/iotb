# First steps!
## Get a new account
Send an e-mail to the system administrator and ask for a new account.
Provide your prefered user name.

To get the system administrator contact information type "info" into the Command-Bar.

## Some rules
Rules for thing and key names
  - minimum name length 6 characters
  - allowed characters: "abcdefghijklmnopqrstuvwxyz0123456789-_."

Rules for user names
  - minimum name length 4 characters
  - allowed characters: "abcdefghijklmnopqrstuvwxyz0123456789-_."

## Command-Bar commands

``` javascript
help:<name>         // open help file <name>
creatething:<name>
createkey:<name>
createuser:<name>
mythings            // show list of my things
mykeys              // show list of my keys
thing:<name>        // open thing by name
key:<name>          // open key by name
user                // show current user settings
info                // show system infos
```

## Some admin hints
Administrator can log in as a user. Just use following login:

Login-name: __adminusername__/__username__ 

Password: __adminuserpassword__

With /query/admindashboard there could be shown more information.


## Additional Brokersettings

Further optional configurations can be done with an additional thing called `brokersettings`.

Type in the top commandline of the web-interface following command:

    creatething:brokersettings

The following default config script

```javascript
    // this ram-variable is used to send EMails to users, which are subscribed to a topic of a thing; here thing=emailtest, topic=test
    
    regemails=ramVar("registeredemailaddresses",{
      emailtest:[
        {topic:"test", email:"snaky.1@gmx.at",token:"1234",validatedtoken:"1234",deletedtoken:""}
      ],
    });
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
          hint:"<b>Hint: Some hint for the users!!!</b>", // optional
          titleimagewidth:"220px",
          // base64 image
          titleimage:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAX8AAABrCAYA...",  // optional
          list:[
            {label: "App 1", description:"App Description", href:"https://..."},
            {label: "App 2", description:"App Description", href:"https://..."}
          ]
        };
      }
    }
  ```