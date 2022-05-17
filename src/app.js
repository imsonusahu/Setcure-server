const express = require('express')
const app = express();
const port = process.env.PORT || 5000

const db = require("./db/conn");
app.use(express.json());
const http = require('http').Server(app);


//Schemas
const OurServices = require("./model/AddOurServices");
const AddBanner = require("./model/Addbanner");
const CityList = require("./model/CityModel");
const productList = require("./model/ProdcutModel");
const allUsers = require("./model/loginApi");
const menuList = require("./model/MenuModel");

const fast2Sms = require('fast-two-sms')
const session = require('express-session')


const io=require('socket.io')(http, {
    cors: {
        origin: ["https://amritb.github.io"]
    }
});



require('dotenv').config();

io.on("connection", (socket) => {
    console.log(`New user connected ${socket.id}`);

    socket.on("ping", () => {
        socket.emit("pong");
    })

    socket.on("join-room", (data) => {
        console.log(data);
        socket.join(data.room);
        data = {...data, code: 200, msg: "Room joined successfully"}

        socket.emit("join-room", data)

    })
});


//GET server response
app.get("/", (req, res) => {
        res.send("Silitics Server is running...")
    }
);


//Admin
app.post("/addServices", async (req, res) => {

    try {
        const services = new OurServices(req.body);
        const newAnimation = await services.save();
        res.status(201).send(newAnimation);
        console.log(newAnimation);

    } catch (error) {

        res.status(400).send({error});
    }
});


//Admin
app.post("/addBanner", async (req, res) => {

    try {
        const addBanner = new AddBanner(req.body);
        const sendBanner = await addBanner.save();
        res.status(201).send(sendBanner);
        console.log(sendBanner);

    } catch (error) {

        res.status(400).send({error});
    }
});

app.post("/getService", async (req, res) => {

    try {
        console.log(req.body.city_name);

        let cityName = req.body.city_name;

        const service = await OurServices.find({city_name: cityName});


        console.log(service);
        res.status(201).send(service);
    } catch (error) {
        res.status(400).send(json({error}));
        console.log(error.message);
    }

});

app.post("/getProducts", async (req, res) => {

    try {
        console.log(req.body.item_name);

        let item_name = req.body.item_type;

        const service = await productList.find({item_type: item_name});
        console.log(service);
        res.status(200).send(service);

    } catch (error) {
        res.status(400).send(json({error}));
        console.log(error.message);
    }

});
app.post("/addProducts", async (req, res) => {

    try {
        const services = new productList(req.body);
        const newAnimation = await services.save();
        res.status(200).send(newAnimation);
        console.log(newAnimation);

    } catch (error) {

        res.status(400).send({error});
    }
});

app.get("/getCityList", async (req, res) => {

    try {

        const banner = await CityList.find();
        console.log(banner);

        res.status(200).send(banner);
    } catch (error) {
        res.status(400).send(json({error}));
        console.log(error.message);
    }


});

app.get("/getBanner", async (req, res) => {

    try {

        const banner = await AddBanner.find();
        console.log(banner);

        res.status(200).send(banner);
    } catch (error) {
        res.status(400).send(json({error}));
        console.log(error.message);
    }

});

app.post('/sendOtp', async (req, res) => {

    //  console.log(res.body)

    try {

        const mobile = req.body.mobile

        console.log("Getting Body from client " + req.body.mobile)

        try {

            const findUserDb = await allUsers.findOne({mobile:mobile});


            if (findUserDb==null){
                console.log("Success")
                let otp = (Math.floor(Math.random() * 1000000) + 1000000).toString().substring(1);


                await sendOtp(mobile,res,otp)

            }else {
                console.log("Failed")
                let otp = (Math.floor(Math.random() * 1000000) + 1000000).toString().substring(1);


                const updateUser = await allUsers.updateOne({mobile: mobile}, {
                    $set: {'otp': otp}
                });

                console.log(findUserDb)

                const options = {
                    authorization: "fuPZOmoSL7qcVC8JkaX3Rt4hbIW5lzsFUEnKg1jY0irA9BQp6vgjNwpCxK02lXGLHIPeqARkW3J7V48a",
                    message: "Your silitics app verification code is  " + otp,
                    numbers: [mobile]

                };

                const resp = await fast2Sms.sendMessage(options)
                const status = resp.return


                let clientRes
                if (status === false) {

                    clientRes = {

                        code: 400,
                        message: "OTP not send."
                    }
                    res.status(400).send(clientRes);

                } else {

                    let sendResp = {
                        code:200,
                        mobile: findUserDb.mobile,
                        msg: "We have successfully sent otp to this " + mobile

                    }

                    res.status(200).send(sendResp);
                }


            }


        }catch (e) {
            console.log("Error  " + e.message)

        }


    } catch (error) {
        res.status(400).send({
            code: 400,
            msg: error + ""
        });
    }


})

async function sendOtp(mobile, res, otp) {


    const options = {
        authorization: "fuPZOmoSL7qcVC8JkaX3Rt4hbIW5lzsFUEnKg1jY0irA9BQp6vgjNwpCxK02lXGLHIPeqARkW3J7V48a",
        message: "Your silitics app verification code is  " + otp,
        numbers: [mobile]

    };

    const resp = await fast2Sms.sendMessage(options)
    const status = resp.return

    let clientRes
    if (status === false) {

        clientRes = {

            code: 400,
            message: "OTP not send."
        }
        res.status(400).send(clientRes);

    } else {

        let saveData = {
            mobile: mobile,
            otp: otp,
            status: 0,
            verified: false
        }


        const user = new allUsers(saveData);
        const response = await user.save();

        let sendResp = {

            code: 200,
            mobile: response.mobile,
            msg: "We have successfully sent otp to this " + mobile

        }

        console.log("OTP is :  " + otp);

        res.status(200).send(sendResp);

    }

}

app.post('/verifyOtp', async (req, res) => {

    try {

        const body = req.body


        const user = await allUsers.find({mobile: body.mobile})
        const userDataDb = user[0]

        console.log(userDataDb)

        const dateDif = new Date() - new Date(userDataDb.updatedAt);
        console.log(dateDif);

        if (body.mobile === userDataDb.mobile && body.otp === userDataDb.otp && dateDif < 60000) {

            const updateUser = await allUsers.updateOne({mobile: body.mobile}, {
                $set: {'verified': true}, $unset: {'otp': body.otp},
            });

            let resp = {
                code: 200,
                _id: userDataDb._id,
                status: userDataDb.status,
                mobile: userDataDb.mobile,
                verified:userDataDb.verified,
                msg: "OTP verification successful"
            }

            res.status(200).send(resp)
        } else {

            let resp = {
                code: 400,
                msg: "Entered otp is not valid"
            }
            if(dateDif > 60000) {
                resp.msg = "OTP expired"
            }

            res.status(400).send(resp)
            console.log('Please enter valid otp')

        }

    } catch (e) {

        res.status(400).send({e})
        console.log(e)
    }

})

app.post('/updateProfile', async (req, res) => {


    try {

        const _id = req.body._id

        console.log(req.body)

        if (_id != null) {
            await allUsers.updateOne({_id: _id}, {$set: {'name': req.body.name}});
            await allUsers.updateOne({_id: _id}, {$set: {'email': req.body.email}});
            await allUsers.updateOne({_id: _id}, {$set: {'firebase_token': req.body.firebase_token}});
            await allUsers.updateOne({_id: _id}, {$set: {'status': 1}});

            const user = await allUsers.findOne({_id: _id});
            res.status(200).send({


                code:200,
                msg: "Added Profile Successfully",
                user
            })

        } else {
            res.status(400).send(
                {
                    code: 400,
                    msg: "user not found"
                }
            )
        }

    } catch (e) {
        console.log("Error : " + e)


        res.status(400).send(
            {
                code: 400,
                msg: e.message
            }
        )
    }

})

//Generate OrderId

app.post("/genOrder",async (req,res)=>{


    var instance = new Razorpay({ key_id: 'rzp_test_SNJKsDZtqjTAT0', key_secret: '2aKkm9VMJJcYI7wYHkgAGj7U' })

    instance.orders.create({
        amount: 50000,
        currency: "INR",
        receipt: "receipt#1",
        notes: {
            key1: "value3",
            key2: "value2"
        }
    })


})


http.listen(port, function() {
    console.log('Server is running on port  '+port);
});

