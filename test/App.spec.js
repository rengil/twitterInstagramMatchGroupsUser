import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import { expect } from 'chai';

import jsdom from 'jsdom'
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.document = doc
global.window = doc.defaultView


var App = require('../app/js/Components/App');
var UserMatchingGroups = require('../app/js/Components/UserMatchingGroups');


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

});
