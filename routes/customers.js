const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
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

router.get('/', async function (req, res) {
    try {
        let customers = await Customer.find();
        if (!customers) {
            res
                .status(400)
                .send("No Customers found");
            return;
        }
        res.status(200).send(customers);
    } catch (err) {
        res.send(err.message);
    }
});


router.get("/:id", async function (req, res) {
    try {
        let customer = await Customer.findById(req.params.id);
        if (!customer) {
            res.status(400).send("The Customer with given id was not found");
            return;
        }
        res.status(200).send(customer);
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/', async function (req, res) {
    try {
        let result = validateCustomer(req.body);
        if (result.error) {
            res.status(400).send(result.error.message);
            return;
        }
        let customer = new Customer({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        });

        customer = await customer.save();
        res.status(200)
            .send(customer);
    } catch (err) {
        res.send(err.message);
    }
});

router.put('/:id', async function (req, res) {
    try {
        let result = validateCustomer(req.body);
        if (result.error) {
            res.status(400)
                .send(result.error.message);
            return;
        }
        let customer = await Customer.findById(req.params.id);
        if (!customer) {
            res.status(400).send("The Customer with the given id was not found");
            return;
        }
        customer.set({
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        });

        let updatedCustomer = await customer.save();
        res.send(updatedCustomer);
    } catch (err) {
        res.send(err.message);
    }
});

router.delete('/:id', async function (req, res) {
    try {
        let customer = await Customer.findById(req.params.id);
        if (!customer) {
            res.status(400).send("Customer with given id was not found");
            return;
        }
        let deletedCustomer = await customer.remove();
        res.status(200)
            .send(deletedCustomer);

    } catch (err) {
        res.send(err.message);
    }
});




var validateCustomer = function (customer) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(11).max(11).required(),
        isGold: Joi.boolean()
    }
    let result = Joi.validate(customer, schema);
    return result;
};
module.exports = router;