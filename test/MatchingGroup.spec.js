import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai, expect } from 'chai';
var fetch = require('node-fetch');
import jsdom from 'jsdom'
global.jsdom = jsdom.jsdom;
global.document = global.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.XMLHttpRequest = global.window.XMLHttpRequest;
var UserMatchingGroups = require('../app/js/Components/UserMatchingGroups');
var MatchingGroup = require('../app/js/Components/MatchingGroup');
var sinon = require('sinon');

describe('<MatchingGroup />', () => {

  it(' has the initial states', () => {
    const wrapper = shallow(<MatchingGroup />);
    wrapper.setProps({ matchGroupName: 'Test' })
    expect(wrapper.state().actualTwitterMatchGroup)
      .to.be.an('object')
      .to.be.empty;

    expect(wrapper.state().actualInstagramMatchGroup)
    .to.be.an('object')
    .to.be.empty;

    expect(wrapper.state().actualKeywords)
    .to.be.an('object')
    .to.be.empty;

    expect(wrapper.state().othersTwitterMatchGroup)
    .to.be.instanceof(Array)
      .to.be.empty;

    expect(wrapper.state().othersInstagramMatchGroup)
    .to.be.instanceof(Array)
    .to.be.empty;

  /*  expect(wrapper.state().actualKeywords).to.equal(false);
    expect(wrapper.state().othersTwitterMatchGroup).to.equal(false);
    expect(wrapper.state().othersInstagramMatchGroup).to.equal(false);
    expect(wrapper.state().matchGroupName).to.equal('Test');*/

  });

  it('should split the instagram and twitter data', () => {

    let data = {
        "userId": "00000001-0002-0003-0004-000000000005",
        "info": {
          "email": "email@example.com",
          "firstName": "string",
          "lastName": "string"
        },
        "twitterMatchGroups": [
          {
            "name": "string",
            "influencers": [
              "string"
            ],
            "keywords": [
              "string"
            ]
          },
          {
            "name": "string2",
            "influencers": [
              "string"
            ],
            "keywords": [
              "string"
            ]
          }
        ],
        "instagramMatchGroups": [
          {
            "name": "string",
            "influencers": [
              "string"
            ],
            "keywords": [
              "string"
            ]
          },
          {
            "name": "string2",
            "influencers": [
              "string"
            ],
            "keywords": [
              "string"
            ]
          }
        ]
      }

    const wrapper = shallow(<MatchingGroup />);
    wrapper.setState({ matchGroupName: 'string' });
    wrapper.instance().splitThisMatchingGroupsFromOthers(data);

    expect(wrapper.state().actualTwitterMatchGroup)
      .to.have.property('name')
      .that.equals('string');

    expect(wrapper.state().actualInstagramMatchGroup)
        .to.have.property('name')
        .that.equals('string');

    expect(wrapper.state().othersTwitterMatchGroup[0])
          .to.have.property('name')
          .that.equals('string2');

    expect(wrapper.state().othersInstagramMatchGroup[0])
            .to.have.property('name')
            .that.equals('string2');

  });

});
