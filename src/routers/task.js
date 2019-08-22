"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var Task_1 = __importDefault(require("../models/Task"));
var auth_1 = __importDefault(require("../middleware/auth"));
var taskRouter = express_1.default.Router();
exports.taskRouter = taskRouter;
taskRouter.post('/tasks', auth_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var task, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                task = new Task_1.default(__assign({}, req.body, { owner: req.user._id }));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, task.save()];
            case 2:
                _a.sent();
                res.status(201).send(task);
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                res.status(400).send(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
taskRouter.get('/tasks', auth_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var match, sort, str, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                match = {};
                sort = {};
                if (req.query.completed) {
                    match.completed = req.query.completed === 'true';
                }
                ;
                if (req.query.sortBy) {
                    str = req.query.sortBy.split(':');
                    //const key = str[0]
                    if (str[1] === 'asc') {
                        sort[str[0]] = 1;
                    }
                    else if (str[1] === 'desc') {
                        sort[str[0]] = -1;
                    }
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // const tasks = await Task.find({'owner':req.user._id});
                //The options object helps us to paginate data
                //The limit value limits number of tasks returned by the top number of tasks as given here
                //
                return [4 /*yield*/, req.user.populate({
                        path: 'tasks',
                        match: match,
                        options: {
                            limit: parseInt(req.query.limit),
                            skip: parseInt(req.query.skip),
                            sort: sort
                        },
                    }).execPopulate()
                    // console.log(typeof(tasks));
                ];
            case 2:
                // const tasks = await Task.find({'owner':req.user._id});
                //The options object helps us to paginate data
                //The limit value limits number of tasks returned by the top number of tasks as given here
                //
                _a.sent();
                // console.log(typeof(tasks));
                res.send(req.user.tasks);
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                res.status(500).send(e_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
taskRouter.get('/tasks/:id', auth_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _id, task, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id;
                console.log(_id);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Task_1.default.findOne({ _id: _id, owner: req.user._id })];
            case 2:
                task = _a.sent();
                if (!task) {
                    res.status(404).send();
                }
                res.send(task);
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                res.status(500).send(e_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
taskRouter.patch("/tasks/:id", auth_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var updates, allowedUpdates, isValid, task_1, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                updates = Object.keys(req.body);
                allowedUpdates = ['completed', 'description'];
                isValid = updates.every(function (update) { return allowedUpdates.includes(update); });
                if (!isValid) {
                    return [2 /*return*/, res.sendStatus(400).send("Invalid Update!")];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, Task_1.default.findOne({ _id: req.params.id, owner: req.user._id })];
            case 2:
                task_1 = _a.sent();
                if (!task_1) {
                    return [2 /*return*/, res.sendStatus(404).send()];
                }
                updates.forEach(function (update) {
                    task_1[update] = req.body[update];
                });
                return [4 /*yield*/, task_1.save({ validateBeforeSave: true })];
            case 3:
                _a.sent();
                res.send(task_1);
                return [3 /*break*/, 5];
            case 4:
                e_4 = _a.sent();
                res.sendStatus(400).send(e_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
//Dont forget the:before id as it will cause an error in the working of node
taskRouter.delete('/tasks/:id', auth_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var _id, task, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = req.params.id.trim();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Task_1.default.findOneAndDelete({ _id: req.params.id, owner: req.user._id })];
            case 2:
                task = _a.sent();
                console.log(req.params.id);
                if (!task) {
                    return [2 /*return*/, res.send(404).send()];
                }
                res.send(task);
                return [3 /*break*/, 4];
            case 3:
                e_5 = _a.sent();
                res.sendStatus(500).send();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
