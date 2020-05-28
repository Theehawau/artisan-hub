const sgMail = require('@sendgrid/mail')
const sendgridApiKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridApiKey)

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'hawau.olamide.th@gmail.com',
        subject: 'Welcome to task manager by Noor',
        text: `Dear ${name}, welcome to the app. Let me know how it goes!!`
     
    }).then(() => {}, error => {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
        }
      });
}
const sendCancelEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'hawau.olamide.th@gmail.com',
        subject: "Sorry to see you go!!",
        text: `Dear ${name}, Goodbye. Let us know why you left us!!`,
      
    }).then(() => {}, error => {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
        }
      });
}
module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}