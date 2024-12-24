// EMail function tested with Microsoft E-Mail Account and SMTP with XOAUTH2
// Feel free to create similar wrappers to other email providers and APIs.


const nodemailer = require('nodemailer');
const { PublicClientApplication, ConfidentialClientApplication } = require('@azure/msal-node');

var wgMailer=function(config){
    var obj={};
    var state={
        token:"",
        refreshunixtimestamp:0,
        transporter:{}
    };
    var _sendMail=function(msg,cb=function(msg){})
    {
        var mailoptions={
            from: config.username,
            to: msg.to,
            subject: msg.subject,
        };
        if (msg.hasOwnProperty("text")) mailoptions.text=msg.text;
        if (msg.hasOwnProperty("html")) mailoptions.html=msg.html;
        state.transporter.sendMail(mailoptions, (error, info) => {
            if (error) {
                cb({error:error,info:info,msg:msg});
            } else {
                cb({info:info,msg:msg});
            }
        });
    };
    var sendMail=function(msg,cb=function(msg){})
    {
        const unixtimestamp=Date.now();
        if (state.refreshunixtimestamp<unixtimestamp)
        {
            const pca = new PublicClientApplication({auth:config.auth});
            pca.acquireTokenByUsernamePassword(config).then(
                function(response)
                {
                    state.token=response.accessToken;
                    state.refreshunixtimestamp=new Date(response.expiresOn).valueOf()-1*60*1000;
                    state.transporter = nodemailer.createTransport({
                        host: "outlook.office365.com",
                        port:587,
                        secure:false,
                        auth: {
                            type: 'OAuth2',
                            user: config.username,
                            accessToken:state.token
                        }
                        //logger: true,
                        //debug: true,            
                    });                
                    _sendMail(msg,cb);
                }
            ).catch(function(error){});
        }
        else
        {
            _sendMail(msg,cb);    
        }
    }
    obj.sendMail=sendMail;
    return obj;
}


module.exports = {mailer:wgMailer};