import UserRegister from './UserRegister';
import UserMatchingGroups from './UserMatchingGroups';
import MatchingGroup from './MatchingGroup';
import React from 'react';
const uuidV1 = require('uuid/v1');
var fetch = require('node-fetch');

/**
 * Represents a the main class of the app
 *
 * @class App
 */

const App = React.createClass({

  userConfig: 'http://108.168.180.148/userconfig/',

  getInitialState: function () {
    return {
      userRegistered: false,
      userInfoArrived: false,
      openMatchingGroup: false,
      userInformation: {
        lastName: '',
        firstName: '',
        email: ''
      },
      userIsTyping: undefined
    }
  },


  componentDidMount: function () {
    const uuid = this.getLocalStorageId();
    const userRegistered = this.checkIfUserRegistered(uuid);
    if (userRegistered) {
      this.fetchUserBasicInformation(uuid).then(userInformation => {
        this.setState({
          userInformation,
          userRegistered: true,
          userInfoArrived: true
        })

        this.fetchMatchingGroups();
      });
    }
  },

  /**
   * Function that check if the UUID of the user is registered in the local Storage
   * @function checkIfUserRegistered
   * @author Renan Lazarini Gil
   * @param {string} uuid - the uuid to be checked in the local Storage
   * @memberOf App
   */
  checkIfUserRegistered: function (uuid) {
    if(!uuid) {
      this.setState({
        userInfoArrived: true
      });
      return false;
    }

    return true;
  },


  /**
   * GET method that returns user information.
   * @function fetchUserBasicInformation
   * @author Renan Lazarini Gil
   * @param {string} uuid - the uuid to be checked in the local Storage
   * @memberOf App
   */
  fetchUserBasicInformation: function ( uuid ) {

    return fetch("http://108.168.180.148/userconfig/info/" + uuid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
        })
        .then((response) =>
          response.json()
        )
        .then((userInformation) =>
          userInformation
        );
  },

  /**
   * Send the User Information. The timeout will always restart when the user is typing
   * @function sendUserInfo
   * @author Renan Lazarini Gil
   * @param {object} data - email, firstName and lastName of the user
   * @memberOf App
   */
  sendUserInfo: function (data) {
    const uuid = this.getLocalStorageId() || this.generateAndSaveNewUUID();

    if (this.state.userIsTyping) {
        clearTimeout(this.state.userIsTyping);
    }

    this.setState(
      {
        userIsTyping:   setTimeout( ()  => {
          this.fethInsertUserBasicInfo(data, uuid).then(response => {
            this.onRegisterUser();
          });
        }, 750)

      });

  },

  /**
   * Save the user informations
   * @function fethInsertUserBasicInfo
   * @author Renan Lazarini Gil
   * @param {object} data - email, firstName and lastName of the user
   * @memberOf App
   */
  fethInsertUserBasicInfo: function (data, uuid) {
    return fetch("http://108.168.180.148/userconfig/info/" + uuid, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                "email": data.email ,
                "firstName": data.firstName,
               "lastName": data.lastName
            }),
        })
        .then((response) => response)
        .then((response) =>
          response
        );
  },

  /**
   * generate a new uuiv and register to the local storage
   * @function generateAndSaveNewUUID
   * @author Renan Lazarini Gil
   * @memberOf App
   */
  generateAndSaveNewUUID: function () {
    const uuid = uuidV1();
    this.setLocalStorageId(uuid);
    return uuid;
  },

  /**
   * Get the users previouly registered matching groups and save in the userConfig state
   * @function fetchMatchingGroups
   * @author Renan Lazarini Gil
  * @memberOf App
   */
  fetchMatchingGroups: function ( ) {
    const uuid = this.getLocalStorageId();

    fetch(this.userConfig + uuid, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then((response) => response.json())
        .then((userConfig) => {
          this.setState({
            userConfig,
            loadedMatchingGroups: true
          });
        });
  },

  /**
   * Get the user UUID in the local storage
   * @function getLocalStorageId
   * @author Renan Lazarini Gil
  * @memberOf App
   */
  getLocalStorageId: function () {
    return localStorage.getItem("id");
  },

  /**
   * Set the user UUID in the local storage
   * @function setLocalStorageId
   * @author Renan Lazarini Gil
   */
  setLocalStorageId: function (uuid) {
    localStorage.setItem("id", uuid)
  },

  /**
   * Function to work as as listener to UserRegister Component and dispatch the fetchMatchingGroups
   * @function onRegisterUser
   * @author Renan Lazarini Gil
   * @memberOf App
   */
  onRegisterUser: function () {
    this.setState({
      userRegistered: true
    });
    this.fetchMatchingGroups();
  },

  /**
   * Function to work as a listener for Matching Group to callback the adding of a new group
   * and open the MatchingGroup
   * @function openMatchingGroup
   * @author Renan Lazarini Gil
   * @method (string) newMatchName - the new group match name
   * @memberOf App
   */
  openMatchingGroup: function (newMatchName) {
    this.setState({
      openMatchingGroup: true,
      matchGroupName: newMatchName
    });
  },

  render: function () {
    // This for avoid showing the message before the request arrive
    if(!this.state.userInfoArrived){
      return  (<div> </div>)
    }

    return (
      <div className='container-fluid'>
        {!this.state.userRegistered ?
          <p className='lead'>
             Hello, and welcome to our app. First we need you to write your information in the left. Then you will start using our app. Dont you worry, you can change any time this info
          </p> : ''
        }

        <div className="first-row row">

          <div className="col-md-1"> </div>

          <div className="col-md-3">
            <UserRegister userInformation={this.state.userInformation}
                          sendUserInfo={this.sendUserInfo}
                          RegisterUser={this.onRegisterUser}/>
          </div>

          <div className="col-md-1"> </div>

          <div className="col-md-6">
              {this.state.userRegistered
                  ? <UserMatchingGroups
                        fetchMatchingGroups={this.fetchMatchingGroups}
                        userConfig={this.state.userConfig}
                        openMatchingGroup={this.openMatchingGroup}/>
                  : ''
              }
          </div>
          <div className="col-md-1"> </div>
        </div>

        {this.state.openMatchingGroup ?
          <div className="second-row row">
            <div className="col-md-1"> </div>
            <div id='matching-group' className="col-md-10">
              <MatchingGroup
               fetchMatchingGroups={this.fetchMatchingGroups}
               matchGroupName={this.state.matchGroupName}/>
            </div>
            <div className="col-md-1"> </div>
          </div>
          : ''
        }
      </div>
    )
  }
});

module.exports = App;
