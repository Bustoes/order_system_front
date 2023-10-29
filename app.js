const express = require('express');
const path = require('path');
const port = "3000";

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');

const app = express();

// 中间件
app.use(express.json());
app.use("/component", express.static(path.join(__dirname, "/component")))
app.use("/public", express.static(path.join(__dirname, 'public')));

// 路由
app.use('/', indexRouter);
app.use('/user', usersRouter);

app.listen(port, function() {
    console.log("server is running at http://localhost:" + port);
})