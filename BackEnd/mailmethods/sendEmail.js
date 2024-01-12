const Mailjet = require('node-mailjet');

const mailjet = new Mailjet({
  apiKey: "19e33075864ebda067410d57a609998b",
  apiSecret: "4a647199fb3df8c8b1f0812f6d1ba57f"
});
module.exports = function (email, subject, text, html, callback) {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: 'gaurav.213027@maimt.com',
          Name: 'Me',
        },
        To: [
          {
            Email: email,
            Name: 'You',
          },
        ],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
      },
    ],
  })
  request
    .then(result => {
      callback(null, result.body)
    })
    .catch(err => {
      callback(err, null);
    })
}