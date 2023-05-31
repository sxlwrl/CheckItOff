'use strict';

const users = require('../controllers/users');
const userModel = require('../models/user-model');

jest.mock('../models/user-model', () => ({
    checkExistingUser: jest.fn(),
    registerUser: jest.fn(),
}));

const mockRegisterRequest = (username, email, password, confirm_password) => ({
    body: {
        username,
        email,
        password,
        confirm_password,
    },
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.render = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res)
    return res;
};

describe('register', () => {
    test(`Return error if there is at least 1 empty field`, async () => {
        const req = mockRegisterRequest('', '', '1234', '1234');
        const res = mockResponse();

        await users.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.render).toHaveBeenCalledWith('register', { msg: 'Username or email is not valid' || 'Password is not entered',
            msg_type: 'error' });
        expect(res.redirect).not.toHaveBeenCalled();
    });

    test(`Return error if confirm password doesn't match with entered password`, async () => {
        const req = mockRegisterRequest('test11', 'test11@gmail.com', '123', '1234');
        const res = mockResponse();

        await users.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.render).toHaveBeenCalledWith('register', { msg: `Password isn't correct`, msg_type: 'error' });
        expect(res.redirect).not.toHaveBeenCalled();
    });

    test(`Return error if username is already taken`, async () => {
        const req = mockRegisterRequest('test11', 'test11@gmail.com', '123', '123');
        const res = mockResponse();

        userModel.checkExistingUser.mockResolvedValue({ isExistingUsername: true, isExistingEmail: false });

        await users.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.render).toHaveBeenCalledWith('register', { msg: `Username is already taken`, msg_type: 'error' });
        expect(res.redirect).not.toHaveBeenCalled();
    });

    test(`Return error if email is already taken`, async () => {
        const req = mockRegisterRequest('test11', 'test11@gmail.com', '123', '123');
        const res = mockResponse();

        userModel.checkExistingUser.mockResolvedValue({ isExistingUsername: false, isExistingEmail: true });

        await users.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.render).toHaveBeenCalledWith('register', { msg: `Email is already taken`, msg_type: 'error' });
        expect(res.redirect).not.toHaveBeenCalled();
    });

    test(`Should register a new user`, async () => {
        const req = mockRegisterRequest('test11', 'test11@gmail.com', '123', '123');
        const res = mockResponse();

        userModel.checkExistingUser.mockResolvedValue({ isExistingUsername: false, isExistingEmail: false });

        await users.register(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.render).toHaveBeenCalledWith('register', { msg: `User registration is successful`, msg_type: 'success' });
    });

    test(`Should delete cookie and redirect to '/`, async () => {
        const req = expect.any(Object);
        const res = mockResponse();

        await users.logout(req, res);

        expect(res.cookie).toHaveBeenCalledWith('account', 'logout', {
            expires: expect.any(Date),
            httpOnly: true,
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});
