import UserRegister from './UserRegister';
import UserMatchingGroups from './UserMatchingGroups';
import MatchingGroup from './MatchingGroup';
import React from 'react';
const uuidV1 = require('uuid/v1');

const App = React.createClass({

  getInitialState: function () {
    return {
      userRegistered: false,
      userInfoArrived: false,
      openMatchingGroup: false,
      userInformation: {
        lastName: '',
        firstName: '',
        email: ''
      }
    }
  },

  componentDidMount: function () {
    const uuid = this.getLocalStorageId();
    const userRegistered = this.checkIfUserRegistered(uuid);
    this.setState({
      userRegistered
    });
  },

  checkIfUserRegistered: function (uuid) {
    if(!uuid) {
      this.setState({
        userInfoArrived: true
      })
      return false;
    }

    $.ajax({
       url: "http://108.168.180.148/userconfig/info/" + uuid,
       contentType: "application/json",
       type: 'GET',
       success: (userInformation) => {
         this.setState({
           userInformation,
           userRegistered: true,
           userInfoArrived: true
         })

         return true;
       }
    });

    return false;
  },

  sendUserInfo: function (data) {
  const uuid = this.getLocalStorageId() || uuidV1();

  if(!this.getLocalStorageId()){
    this.setLocalStorageId(uuid);
  }

  $.ajax({
         url: "http://108.168.180.148/userconfig/info/" + uuid,
         contentType: "application/json",
         type: 'PUT',
         data:  JSON.stringify({
           	"email": data.email ,
           	"firstName": data.firstName,
            "lastName": data.lastName
         }),
         success: (response) => {
           this.onRegisterUser();
         }
      });
  },

  getLocalStorageId: function () {
    return localStorage.getItem("id");
  },

  setLocalStorageId: function (uuid) {
    localStorage.setItem("id", uuid)
  },

  onRegisterUser: function () {
    this.setState({
      userRegistered: true
    });
  },

  onAddMatchingGroup: function () {
    //FETCH COM A ADIÇÃO DO NOVO MATCHING GROUP
    this.setState({
      openMatchingGroup: true
    });
  },

  render: function () {
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
        <div className=" my-app row">

          <div className="col-md-1"> </div>
          <div className="col-md-3">
            <UserRegister userInformation={this.state.userInformation}
                          sendUserInfo={this.sendUserInfo}
                          RegisterUser={this.onRegisterUser}/>
          </div>
          <div className="col-md-1"> </div>
          <div className="col-md-7">
          {this.state.userRegistered
              ? <UserMatchingGroups onAddMatchingGroup={this.onAddMatchingGroup}/>
              : ''
          }
          </div>

          {this.state.openMatchingGroup ?
          <div className="row">
            <div className="col-md-1"> </div>
            <div className="col-md-10">
              <MatchingGroup/>
            </div>
            <div className="col-md-1"> </div>
          </div>
          : ''
          }
        </div>
      </div>
    )
  }
});

module.exports = App;
