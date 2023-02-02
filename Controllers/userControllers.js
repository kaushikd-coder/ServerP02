const User = require('../models/userSchema');
const moment = require("moment");

exports.userpost = async (req, res, next) => {
    const file = req.file.filename;
    const { fname, lname, email, mobile, gender, location, status } = req.body;

    if (!fname || !lname || !email || !mobile || !gender || !location || !status || !file) {
        res.status(401).json("All Inputs is required")
    }

    try {
        const preUser = await User.findOne({ email });
        if (preUser) {
            res.status(401).json("User already exists")
        } else {
            const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
            const userData = new User({
                fname,
                lname,
                email,
                mobile,
                gender,
                location,
                status,
                profile: file,
                datecreated
            })
            await userData.save();
            res.status(201).json({ userData })
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

//getting the user Details
exports.userget = async (req, res, next) => {
    try {
        const userData = await User.find();
        res.status(200).json({ userData });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
}

// get single user
exports.singleuserget = async (req, res, next) => {
    const { id } = req.params;
    try {
        const userData = await User.findById({ _id: id });
        res.status(200).json({ userData });
    } catch (error) {
        res.status(500).json({
            message: `Something went wrong${error}`
        })
    }
}

exports.useredit = async (req, res) => {
    const { id } = req.params;
    const { fname, lname, email, mobile, gender, location, status, user_profile } = req.body;
    const file = req.file ? req.file.filename : user_profile

    const dateUpdated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    try {
        const updateuser = await User.findByIdAndUpdate({ _id: id }, {
            fname, lname, email, mobile, gender, location, status, profile: file, dateUpdated
        }, {
            new: true
        });

        await updateuser.save();
        res.status(200).json({updateuser});
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.userDelete = async(req, res, next) => {
    const { id } = req.params;
    try {
        const deleteUser = await User.findByIdAndDelete({ _id: id });
        res.status(200).json({ deleteUser });
    } catch (error) {
        res.status(500).json({
            message: `Something went wrong${error}`
        })
    }
}