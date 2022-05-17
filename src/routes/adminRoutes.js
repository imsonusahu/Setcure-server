const app=require('express')
const routes=app.Router()

routes.post('/')


/*
/api/admin/
    /api/partner/
    /api/user/*/
 //Admin
/*app.post("/addServices", async (req, res) => {

    try {
        const services = new OurServices(req.body);
        const newAnimation = await services.save();
        res.status(201).send(newAnimation);
        console.log(newAnimation);

    } catch (error) {

        res.status(400).send({error});
    }
});*/


