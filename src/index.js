const app = require("./app");
// const express = require('express')
// require('./db/mongoose')
// const userRouter = require('./routers/user')
// const taskRouter = require('./routers/task')

// var bodyParser = require('body-parser');

// const app = express()
const port = process.env.PORT;

// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
// app.use(userRouter)
// app.use(taskRouter)

app.listen(port, () => {
	console.log("Server running on port " + port);
});
