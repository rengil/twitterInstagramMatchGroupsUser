import React from 'react';

let sendInfoURL = 'http://108.168.180.148/userconfig/info/e6147626-d1ea-11e6-bf26-cec0c932ce01';

/**
 *  Represent the user data
 *
 * @class UserRegister
 */


const UserRegister = React.createClass({

  getInitialState: function () {
    return {
      email: this.props.userInformation.email,
      firstName: this.props.userInformation.firstName,
      lastName: this.props.userInformation.lastName,
    }
  },

  /**
   * Controls the changes of the inputs and the auto save of the user data
   * @function onChangeInput
   * @author Renan Lazarini Gil
   * @method (string) inputName - which input was changed
   * @method (string) event - the event to get the value
  * @memberOf UserRegister
   */

  onChangeInput: function (inputName, event) {
    const newState = Object.assign({},this.state);
    const _this = this;
    newState[inputName] = event.target.value;
    this.setState(
      newState, function () {
        _this.props.sendUserInfo(_this.state)
      }
    )
  },

  render: function () {
    return (
      <div>
      <div className='page-content user-information'>
        <h2> Your informations </h2>
        <form className='user-info'>
          <div className="form-group">
           <label htmlFor="firstNameInput">First Name</label>
           <input onChange={this.onChangeInput.bind(this, 'firstName')}
                  type="text"
                  className="form-control"
                  id='firstNameInput'
                  value={this.state.firstName}
          />
          </div>

          <div className="form-group">
           <label htmlFor="secondNameInput">Second Name</label>
           <input onChange={this.onChangeInput.bind(this, 'lastName')}
                  type="text"
                  className="form-control"
                  id='secondNameInput'
                  value={this.state.lastName}
           />
          </div>

          <div className="form-group">
           <label htmlFor="emailInput">Email address</label>
           <input onChange={this.onChangeInput.bind(this, 'email')}
                  type="email"
                  className="form-control"
                  id='emailInput'
                  value={this.state.email}
          />
          </div>

        </form>
        </div>
      </div>
    )
  }
});

UserRegister.defaultProps = {
  userInformation: {
    firstName: '',
    lastName: '',
    email: ''
  },
  sendUserInfo: function () {

  }
}

module.exports = UserRegister;
