// models are moved into seperate file

const mongoose = require('mongoose');
const Joi = require('joi');


const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11
    }
});

const Customer = mongoose.model("Customer", customerSchema);

var validateCustomer = function (customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(11).max(11).required(),
        isGold: Joi.boolean()
    }
    let result = Joi.validate(customer, schema);
    return result;
};

// export Customer class and validateCustomer function

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;