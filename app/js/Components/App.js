import UserRegister from './UserRegister';
import UserMatchingGroups from './UserMatchingGroups';
import MatchingGroup from './MatchingGroup';
import React from 'react';

const App = React.createClass({

  getInitialState: function () {
    return {
      userRegistered: false,
      openMatchingGroup: false,
    }
  },

  componentDidMount: function () {
    const userRegistered = this.checkIfUserRegistered;
    this.setState({
      userRegistered: false
    });
  },

  checkIfUserRegistered: function () {
    // TO DO -- PEGAR DA STORE DO NAVEGADOR
    return false;
  },

  onRegisterUser: function () {
    this.setState({
      userRegistered: true
    });
  },

  addMatchingGroup: function () {
    //FETCH COM A ADIÇÃO DO NOVO MATCHING GROUP
    this.setState({
      openMatchingGroup: true
    });
  },

  render: function () {
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
            <UserRegister onRegisterUser={this.onRegisterUser}/>
          </div>
          <div className="col-md-1"> </div>
          <div className="col-md-7">
          {this.state.userRegistered
              ? <UserMatchingGroups addMatchingGroup={this.addMatchingGroup}/>
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
