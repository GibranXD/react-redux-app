import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const getUser = async (req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ['uuid', 'name', 'email', 'role']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}
export const getUserById = async (req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ['uuid', 'name', 'email', 'role'],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }

}
export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ msg: "Password not match" });
    const hashPasword = await argon2.hash(password);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPasword,
            role: role
        });
        res.status(201).json({ msg: "Register success" });
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}
export const updateUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(404).json({ msg: "User not found" });
    const { name, email, password, confPassword, role } = req.body;
    let hashPasword;
    if (password === "" || password === null) {
        hashPasword = user.password
    } else {
        hashPasword = await argon2.hash(password);
    }
    if (password !== confPassword) return res.status(400).json({ msg: "Passowrd not match" });
    try {
        await Users.update({
            name: name,
            email: email,
            password: hashPasword,
            role: role
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "User updated" });
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }

}
export const deleteUser = async (req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!user) return res.status(400).json({ msg: "User not found" });
    try {
        await Users.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "User deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }


}