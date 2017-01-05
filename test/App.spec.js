import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai, expect } from 'chai';

import jsdom from 'jsdom'

jsdom.env(
  "",
  [require.resolve("jquery")],
  function (errors, window) {
    // use window.$
  }
);


global.jsdom = jsdom.jsdom;
global.document = global.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.XMLHttpRequest = global.window.XMLHttpRequest;
global.sinon = require('sinon');
global.sinon.useFakeXMLHttpRequest();
global.window.XMLHttpRequest = global.XMLHttpRequest;
global.$ = require('jquery')(global.window);


var App = require('../app/js/Components/App');
var UserMatchingGroups = require('../app/js/Components/UserMatchingGroups');
var MatchingGroup = require('../app/js/Components/MatchingGroup');

describe('<App />', () => {

  before(function() {
    // runs before all tests in this block
  });

  it(' has the initial states', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.state().userRegistered).to.equal(false);
    expect(wrapper.state().userInfoArrived).to.equal(false);
    expect(wrapper.state().openMatchingGroup).to.equal(false);
    expect(wrapper.state().userInformation).to.include.keys('firstName');
    expect(wrapper.state().userInformation).to.include.keys('lastName');
    expect(wrapper.state().userInformation).to.include.keys('email');
    expect(wrapper.find(UserMatchingGroups)).to.have.length(0);

  });

  it(' when userRegistered true. Show UserMatchingGroups', () => {
    const wrapper = mount(<App />);
    wrapper.setState({ userRegistered: true });
    expect(wrapper.find(UserMatchingGroups)).to.have.length(1);

  });

  it(' when openMatchingGroup true. Show MatchingGroup', () => {
    const wrapper = mount(<App />);
    wrapper.setState({ openMatchingGroup: true });
    expect(wrapper.find(MatchingGroup)).to.have.length(1);

  });

});
