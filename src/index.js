"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_1 = require("./routers/user");
var task_1 = require("./routers/task");
var body_parser_1 = __importDefault(require("body-parser"));
var useBodyParser = body_parser_1.default.json();
var app = express_1.default();
require("./db/mongodb");
var port = process.env.PORT || 3000;
app.use(useBodyParser);
app.use(user_1.router1);
app.use(task_1.taskRouter);
app.listen(port, function () {
    console.log('server running on' + port);
});
