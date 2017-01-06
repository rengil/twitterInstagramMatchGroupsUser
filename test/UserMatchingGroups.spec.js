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

describe('<UserMatchingGroups />', () => {

  it('gets the union with no repetition of the Instagram and Twitter influencers', () => {

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

      const wrapper = shallow(<UserMatchingGroups />);
      wrapper.instance().getUserMatchingGroups(data);
      expect(wrapper.state().matchingGroups[0]).to.equal('string');
      expect(wrapper.state().matchingGroups[1]).to.equal('string2');
  });

  it('get the new name of a new match group', () => {
      const wrapper = shallow(<UserMatchingGroups />);
      wrapper.setState({ matchingGroups: ['string', 'string2'] });
      const userMatchingGroupName = wrapper.instance().getMatchGroup();
      expect(userMatchingGroupName.name).to.equal("new matching group 3");

  });
});
