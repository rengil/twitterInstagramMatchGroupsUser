import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai, expect } from 'chai';
var fetch = require('node-fetch');
import jsdom from 'jsdom'
global.jsdom = jsdom.jsdom;
global.document = global.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.XMLHttpRequest = global.window.XMLHttpRequest;
var App = require('../app/js/Components/App');
var UserMatchingGroups = require('../app/js/Components/UserMatchingGroups');
var MatchingGroup = require('../app/js/Components/MatchingGroup');
var sinon = require('sinon');

describe('<App />', () => {

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


    it(' when record local storage uuid , it should get the same value', () => {
      const wrapper = shallow(<App />);
      wrapper.instance().setLocalStorageId(11);
      expect(wrapper.instance().getLocalStorageId()).to.equal('11');
    });

    it(' given uuid should give you information', (done) => {
      const wrapper = shallow(<App />);
      let data = {
        firstName: 'chai',
        secondName: 'jasmine',
        email: 'chai@test.com.br'
      }
      wrapper.instance().fethInsertUserBasicInfo(data, 'c0e010c0-d390-11e6-953a-573fa9b67d9f').then(
      function (result) {
        wrapper.instance().fetchUserBasicInformation('c0e010c0-d390-11e6-953a-573fa9b67d9f').then(
        function (result) {
            expect(result.firstName).to.equal('chai');
            done();
        },
        function (err) {
           done(err);
        });
        done();
      },

      function (err) {
         done(err);
      });
    });

});
