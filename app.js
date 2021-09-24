const express = require("express");
const app = express();
const port = 3000;
// body-parser
const bodyParser = require("body-parser");
// https
const https = require("https");
const { response } = require("express");
const { json } = require("body-parser");

// static public files.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: { FNAME: firstName, LNAME: lastName },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  //! Add your list key here.
  const url = "https://us1.api.mailchimp.com/3.0/lists/your list key here";

  const options = {
    method: "POST",
    //! Add your auth key here.
    auth: "your auth key here",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || port, function () {
  console.log(`Server is listing at : http://localhost:${port}`);
});
