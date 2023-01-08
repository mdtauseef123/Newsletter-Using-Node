const express=require("express");
const app=express();
const body_parser=require("body-parser");
const https=require("https");

app.use(express.static("public"));
app.use(body_parser.urlencoded({extended:true}));

app.listen(process.env.PORT || 3000,function(){
    console.log("Sever is running on port 3000.");
});


app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    //Accepting the post request from form i.e. first-name last-name and user's email
    const first_name=req.body.first_name;
    const last_name=req.body.last_name;
    const user_email=req.body.user_email;
    //MailChimp API End-Point
    //us21 is copied from API KEY last characters which represents the server number which is alloted to us.
    const url="https://us21.api.mailchimp.com/3.0/lists/a6e10d00fb";
    //Data to be posted on Mail-Chimp Server
    const data={
        members: [
            {
                email_address: user_email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first_name,
                    LNAME: last_name
                }
            }
        ]
    };
    //Since the data to be posted should be in the object but in string form
    //So we compressed down the above data into string form using stringify method.
    const json_data=JSON.stringify(data);
    //Finally in order to make request to Mail-Chimp Sever we have to create two parameters first one is url, second one is options
    //which contain mandatory things like method and API KEY. 
    // We can use anything in-place of mdtauseef123. It just should be the string and after : it would contain API KEY.
    const options={
        method: "POST",
        auth: "mdtauseef123:a01fe487edc9677976c0296aef7aea9cb-us21"
    };
    //Making request to Mailchimp Sever using request() and storing that request in a variable called request
    //We use request in order to send the above JSON-Data using write();
    const request=https.request(url, options, function(response){
        if(response.statusCode===200)
        res.sendFile(__dirname+"/success.html");
        else
        res.sendFile(__dirname+"/failure.html");
    });
    //Writing data to the mailchimp
    request.write(json_data);
    request.end();
});


//Handling the failure post that will redirect the user to again to the sign up page
app.post("/failure", function(req,res){
    res.redirect("/");
});

//API Key:- 01fe487edc9677976c0296aef7aea9cb-us21
//Audience ID:- a6e10d00fb