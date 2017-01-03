import UserRegister from './UserRegister';
import UserMatchingGroups from './UserMatchingGroups';
import React from 'react';

const App = React.createClass({

  getInitialState: function () {
    return {
      userRegistered: false
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

  render: function () {
    return (
      <div>
        {this.state.userRegistered
            ? <UserMatchingGroups/>
            : <UserRegister onRegisterUser={this.onRegisterUser}/>
        }
      </div>
    )
  }
});

module.exports = App;
