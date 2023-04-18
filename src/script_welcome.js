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

btn_sign.forEach(item => item.addEventListener('click', function() {
    loginSection.classList.toggle('hidden');
    regSection.classList.toggle('hidden');
}))



