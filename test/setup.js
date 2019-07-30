//to make sure the environmental variables are loaded when we run tests, so we use the dotenv module
require('dotenv').config();
//As you progress with libraries such as chai, you might want to install plugins that add features to chai, 
//this file would be the ideal place to do that.
const { expect } = require('chai');
const supertest = require('supertest');

//sets two global variables.
global.expect = expect;
global.supertest = supertest;