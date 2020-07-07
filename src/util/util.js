const delay = async time => new Promise(resolve => setTimeout(resolve, time));
const typeCheck
    = (target, type) => Object.prototype.toString.call(target) === `[object ${type}]`;
module.exports = {
    delay,
    typeCheck
};

