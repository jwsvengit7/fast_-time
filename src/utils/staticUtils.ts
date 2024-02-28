import EmailUtils from "./emailUtils";

class StaticUtils{

   public static getMailUtils(){
        return  new EmailUtils()
    }

    
}

export default StaticUtils