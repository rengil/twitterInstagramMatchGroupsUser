import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai, expect } from 'chai';
var fetch = require('node-fetch');
import jsdom from 'jsdom'
global.jsdom = jsdom.jsdom;
global.document = global.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.XMLHttpRequest = global.window.XMLHttpRequest;
var UserRegister = require('../app/js/Components/UserRegister');
var UserMatchingGroups = require('../app/js/Components/UserMatchingGroups');
var MatchingGroup = require('../app/js/Components/MatchingGroup');
var sinon = require('sinon');

describe('<UserRegister />', () => {

    it(' When change input, should change only the input', () => {


      const wrapper = shallow(<UserRegister />);
      var a = {};
      a.target = {};
      a.target.value = 'new name';
      wrapper.setProps({ userInformation: 'teste'})

      expect(wrapper.state().firstName).to.not.equal('new name');
      expect(wrapper.state().lastName).to.not.equal('new last name');
      expect(wrapper.state().email).to.not.equal('new email');

      wrapper.instance().onChangeInput('firstName', a)

      expect(wrapper.state().firstName).to.equal('new name');
      expect(wrapper.state().lastName).to.not.equal('new last name');
      expect(wrapper.state().email).to.not.equal('new email');
      a.target.value = 'new last name';
      wrapper.instance().onChangeInput('lastName', a)

      expect(wrapper.state().firstName).to.equal('new name');
      expect(wrapper.state().lastName).to.equal('new last name');
      expect(wrapper.state().email).to.not.equal('new email');
      a.target.value = 'new email';
      wrapper.instance().onChangeInput('email', a)
      expect(wrapper.state().firstName).to.equal('new name');
      expect(wrapper.state().lastName).to.equal('new last name');
      expect(wrapper.state().email).to.equal('new email');
    });

});
