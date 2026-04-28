"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncErrorWrapper = void 0;
const asyncErrorWrapper = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncErrorWrapper = asyncErrorWrapper;
