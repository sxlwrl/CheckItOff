'use strict';

const loginButton = document.querySelector('.btn--login');
const regButton = document.querySelector('.btn--register');

// rename variable
// rename html element
const btn_sign = document.querySelectorAll('.btn-sign-back');

const loginValue = document.querySelector('#login');
const passwordValue = document.querySelector('#password');

const loginSection = document.querySelector('.section--login');
const regSection = document.querySelector('.section--register');

const temp_acc = {
    login: 'test00',
    password: '123123',
};

loginButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (loginValue.value === temp_acc.login && passwordValue.value === temp_acc.password) {
        window.location.href = 'main.html';
    }

})

btn_sign.forEach(item => item.addEventListener('click', function() {
    loginSection.classList.toggle('hidden');
    regSection.classList.toggle('hidden');
}))



