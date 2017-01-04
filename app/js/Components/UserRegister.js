import React from 'react';

let sendInfoURL = 'http://108.168.180.148/userconfig/info/e6147626-d1ea-11e6-bf26-cec0c932ce01';

const UserRegister = React.createClass({


  sendUserInfo: function () {
    $.ajax({
       url: sendInfoURL,
       contentType: "application/json",
       type: 'PUT',
       data:  JSON.stringify({
         	"email": 'renanteste@teste.com.br',
         	"firstName": 'renanteste',
          "lastName": 'renanteste'
       }),
       success: (response) => {
         this.props.onRegisterUser();
       }
    });
  },

  render: function () {
    return (
      <div>
      <div className='page-content'>
        <h2> Your informations </h2>
        <form className='user-info'>
          <div className="form-group">
           <label htmlFor="firstNameInput">First Name</label>
           <input onChange={this.sendUserInfo} type="text" className="form-control" id='firstNameInput'/>
          </div>

          <div className="form-group">
           <label htmlFor="secondNameInput">Second Name</label>
           <input onChange={this.sendUserInfo} type="text" className="form-control" id='secondNameInput'/>
          </div>

          <div className="form-group">
           <label htmlFor="emailInput">Email address</label>
           <input onChange={this.sendUserInfo} type="email" className="form-control" id='emailInput'/>
          </div>

        </form>
        </div>
      </div>
    )
  }
});

module.exports = UserRegister;
