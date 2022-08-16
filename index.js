require('dotenv').config();
const express = require('express');
const mongo = require('./shared/mongo');
const middleware = require('./shared/middleware');
const routes = require('./routes/allRoutes');
const cors  = require("cors");

const stripeRoute = require('./routes/stripe.routes');

const PORT = process.env.PORT || 3003
const app = express();

(async()=> {
    try {
        // mongo DB connection
        await mongo.connect();

        // middleware
        
        app.use(cors());
        app.use(express.json({limit:"50mb"}));
        app.use(middleware.logging);
        app.use(middleware.maintenance);
        console.log('middleware initiating ');

        // routes
        app.get('/', (req,res)=> res.send('hello world'));
    
        app.use("/auth", routes.authRoute);
        app.use('/products', routes.productsRoute);
        app.use("/users", routes.usersRoute);
        app.use('/checkout', stripeRoute);
        app.use('/orders', routes.ordersRoute);
        app.use("/admin",routes.adminRoute);
        app.use(middleware.auth_Service);
        console.log('routes initiating');

        // port
        app.listen(process.env.PORT, ()=> console.log(`server listening at a ${process.env.PORT}`))
    } catch (error) {
        console.log('error starting application', error.message);
    }
})();