'use strict';

const bcrypt = require('bcryptjs');
const userModel= require('../models/user-model');

const dayToMilliseconds = (day) => (day * 24 * 60 * 60 * 1000);

class RenderText {
    constructor(res, status, page, errorMessage) {
        this.res = res;
        this.status = status;
        this.page = page;
        this.errorMessage = errorMessage;
    };

    renderError = () => {
        return this.res.status(this.status).render(this.page, { msg: this.errorMessage, msg_type: 'error' });
    };

    renderSuccess = () => {
        return this.res.status(this.status).render(this.page, { msg: this.errorMessage, msg_type: 'success' });
    };
}

class User {
    async login(req, res) {
        const {data, password} = req.body;

        if (!data || !password) {
            return new RenderText(res, 400, 'login', `There is an empty field`).renderError();
        }

        try {
            const user = await userModel.getUser(data);

            if (!user || !(await userModel.comparePassword(password, user?.PASS))) {
                return new RenderText(res, 401, 'login', `Email or password isn't correct`).renderError();
            }

            const token = await userModel.generateToken(user.ID);

            const cookieOptions = {
                expires: new Date(Date.now() + dayToMilliseconds(process.env.JWT_COOKIE_EXPIRES)),
                httpOnly: true,
            }

            res.cookie(`account`, token, cookieOptions);
            res.status(200).redirect('/main');

        }
        catch (error) {
            console.error(error);
        }
    };

    async register(req, res) {
        const {username, email, password, confirm_password} = req.body;

        const errorMessage = (!username || !email) ? `Username or email is not valid` :
                (!password || !confirm_password) ? `Password is not entered` :
                (password !== confirm_password) ? `Password isn't correct` : ``;

        if (errorMessage) {
            return new RenderText(res, 400, 'register', errorMessage).renderError();
        }

        try {
            const result = await userModel.checkExistingUser(username, email);

            const errorMessage = result.isExistingUsername ? `Username is already taken` :
                result.isExistingEmail ? `Email is already taken` : '';

            if (errorMessage) {
                return new RenderText(res, 400, 'register', errorMessage).renderError();
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await userModel.registerUser(username, email, hashedPassword);
            return new RenderText(res, 200, 'register', `User registration is successful`).renderSuccess();
        }
        catch (error) {
            console.error(error.message);
        }

    };

    async logout(req, res) {
        res.cookie('account', 'logout', {
            expires: new Date(Date.now() + 2 * 1000),
            httpOnly: true,
        });
        res.status(200).redirect('/');
    };
}

module.exports = new User();
