import fs from 'fs';
import { MAIL_USER} from './valuesUtils';

// Read the HTML template file
const htmlTemplate = fs.readFileSync('/Users/jwsven/Desktop/node-project/fast_-time/src/templates/email_verification.html', 'utf8');
const htmlTemplateLink = fs.readFileSync('/Users/jwsven/Desktop/node-project/fast_-time/src/templates/link_verification.html', 'utf8');
const user =MAIL_USER as string

function signupTemplate(email:string,otp:number){
    const emailBody = htmlTemplate.replace('{{otp}}', ""+otp);
    console.log(email)
 
  return   { 
    from: `Fast Time <${user}>`,
    to: email,
    subject: "Account Verification OTP",
    html: emailBody,
};

}

function signupTemplateForLink(email:string,link:string){
    const emailBody = htmlTemplateLink.replace('{{link}}', link);
    console.log(link)
 
  return   { 
    from: `Fast Time <${user}>`,
    to: email,
    subject: "Account Verification OTP",
    html: emailBody,
};

}


export {
    signupTemplate  ,signupTemplateForLink
}