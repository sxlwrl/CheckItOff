'use strict';

const users = require('../controllers/users');
const userModel = require('../models/user-model');

jest.mock('../models/user-model', () => ({
    getUser: jest.fn(),
    comparePassword: jest.fn(),
    generateToken: jest.fn(),
}));

const mockLoginRequest = (data, password) => ({
    body: {
        data,
        password,
    },
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.render = jest.fn().mockReturnValue(res);
    res.cookie = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
};

describe('login', () => {
    test('Return error if username or email, or password is missing', async () => {
        const req = mockLoginRequest('', '');
        const res = mockResponse();

        await users.login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.render).toHaveBeenCalledWith('login', {
            msg: `There is an empty field`,
            msg_type: 'error',
        });
        expect(res.cookie).not.toHaveBeenCalled();
        expect(res.redirect).not.toHaveBeenCalled();
    });

    test('Return error if username or email is incorrect', async () => {
        const req = mockLoginRequest('test112', '1234');
        const res = mockResponse();

        await userModel.getUser.mockResolvedValue(undefined);

        await users.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.render).toHaveBeenCalledWith('login', {
            msg: `Email or password isn't correct`,
            msg_type: 'error',
        });
        expect(res.cookie).not.toHaveBeenCalled();
        expect(res.redirect).not.toHaveBeenCalled();
    });

    test('Generate token and set cookie if user and password are correct', async () => {
        const req = mockLoginRequest('test11', '123');
        const res = mockResponse();

        await userModel.getUser.mockResolvedValue(expect.any(Object));
        await userModel.comparePassword.mockResolvedValue(true);
        await userModel.generateToken.mockResolvedValue(expect.any(String));

        await users.login(req, res);

        expect(res.cookie).toHaveBeenCalledWith('account', expect.any(String), expect.any(Object));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.redirect).toHaveBeenCalledWith('/main');
    });
});



