const app = require('./app') //importing app
const connectdb = require('./config/connectdb')

require('dotenv').config()

//Creating server
app.listen(process.env.PORT, () => {
    console.log(`Server is running at port: ${process.env.PORT}`)
})