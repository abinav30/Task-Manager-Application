"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importStar(require("mongoose"));
var validator_1 = __importDefault(require("validator"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var charValidator = function (str) {
    return new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g).test(str);
};
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: function (value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error("not a valid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate: function (value) {
            if (validator_1.default.isLowercase(value) || (validator_1.default.isAlphanumeric(value) && !charValidator(value)) || value.length <= 6 || validator_1.default.isUppercase(value) || value.toLowerCase().includes('password')) {
                throw new Error('Password is invalid! must contain at least one uppercase character, one lowercase character,must be \n at least 7 characters long and must atleast contain a number or a symbol\n and must nbot contain the word password');
            }
        }
    },
    age: {
        type: Number,
        validate: function (value) {
            if (value < 0) {
                throw new Error('Age must be a posititve');
            }
        }
    },
    tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
});
//hashes password before saving
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function () {
        var user, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    user = this;
                    if (!user.isModified('password')) return [3 /*break*/, 2];
                    _a = user;
                    return [4 /*yield*/, bcryptjs_1.default.hash(user.password, 8)];
                case 1:
                    _a.password = _b.sent();
                    _b.label = 2;
                case 2:
                    console.log('just before save');
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
//Verifies is a user is present by credentials
UserSchema.statics.findByCredentials = function (email, password) { return __awaiter(_this, void 0, void 0, function () {
    var user, isMatch;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.findOne({ email: email }).exec()];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new Error('UNABLE TO LOGIN!');
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                isMatch = _a.sent();
                // console.log(isMatch)
                if (!isMatch) {
                    throw new Error("Unable to login");
                }
                return [2 /*return*/, user];
        }
    });
}); };
//Login token generator
UserSchema.methods.generateAuthToken = function (user) {
    return __awaiter(this, void 0, void 0, function () {
        var id, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!user) {
                        return [2 /*return*/];
                    }
                    id = user._id.toString();
                    return [4 /*yield*/, jsonwebtoken_1.default.sign({ _id: id }, 'thisismyapp', { expiresIn: "7 days" })];
                case 1:
                    token = _a.sent();
                    user.tokens = user.tokens.concat({ token: token });
                    return [4 /*yield*/, user.save()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, token];
            }
        });
    });
};
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};
UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});
var User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
