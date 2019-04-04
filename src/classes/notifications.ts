import * as axios from "axios";

/**
 * This class is used to interact with the Notifications system.
 */
export class Notifications {
  
  /**
   * The url used to connect with the Notifications system.
   *
   * @type string
   */
  private static readonly url = "https://fnbsim.southafricanorth.cloudapp.azure.com";

  /**
   * Sends a notification the the client specified.
   * 
   * @param clientID - The client to send the notificaiton to
   * @param subject - The subject line for the notification
   * @param message - The message of the notification
   * @returns Whether or not the notification was sent
   */
  public static async notify(clientID: string, subject: string, message: string): Promise<boolean> {
    let config = {
      headers: {
        "Content-Type": 'application/json'
      }
    };

    let data = {
      clientID : clientID,
      subject : subject,
      message : message
    };

    let success = false;

    await axios.default.post(this.url + "/notify", data, config)
    .then(response =>{
      if(response.status == 200){
        success = true;
      }
    })
    .catch(error => {
      console.error("Notification Error - ", error.status, " ", error.data);
      success = false;
    });
    return success;
  }

}