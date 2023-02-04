const User = require('../models/userSchema');
const moment = require("moment");
const csv = require('fast-csv');
const fs = require('fs');


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

    const search = req.query.search || "";
    const gender = req.query.gender || "";
    const status = req.query.status || "";
    const sort = req.query.sort || "";
    const regex = {
        fname: {
            $regex: search, $options: "i"
        },
    }
    if (gender !== "All") {
        regex.gender = gender
    }
    if (status !== "All") {
        regex.status = status
    }
    try {
        const userData = await User.find(regex)
            .sort({ datecreated: sort === "new" ? -1 : 1 });
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
        res.status(200).json({ updateuser });
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.userDelete = async (req, res, next) => {
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

exports.userStatus = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    try {
        const userStatusUpdate = await User.findByIdAndUpdate({ _id: id }, { status: data }, { new: true });
        res.status(200).json({ userStatusUpdate });
    } catch (error) {
        res.status(500).json({
            message: `Something went wrong${error}`
        })
    }
}

exports.userExport = async (req, res, next) => {
    try {
        const userData = await User.find();

        const csvStream = csv.format({ headers: true });
        if (!fs.existsSync('public/files/export')) {
            if (!fs.existsSync('./public/files')) {
                fs.mkdirSync('./public/files');
            }

            if (!fs.existsSync('./public/files/export')) {
                fs.mkdirSync('./public/files/export');
            }
        }

        const writableStream = fs.createWriteStream('public/files/export/users.csv');
        csvStream.pipe(writableStream);

        writableStream.on("finish", function () {
            res.json({
                downloadUrl: "http://localhost:5000/files/export/users.csv"
            });
        });

        if (userData.length > 0) {
            userData.map((user) => {
                csvStream.write({
                    FirstName: user.fname ? user.fname : "-",
                    LastName: user.lname ? user.lname : "-",
                    Email: user.email ? user.email : "-",
                    Phone: user.mobile ? user.mobile : "-",
                    Gender: user.gender ? user.gender : "-",
                    Status: user.status ? user.status : "-",
                    Profile: user.profile ? user.profile : "-",
                    Location: user.location ? user.location : "-",
                    DateCreated: user.datecreated ? user.datecreated : "-",
                    DateUpdated: user.dateUpdated ? user.dateUpdated : "-",
                })
            })
        }
        csvStream.end();
        writableStream.end();

        } catch (error) {
            res.status(500).json({
                message: `Something went wrong${error}`
            })
        }
    }