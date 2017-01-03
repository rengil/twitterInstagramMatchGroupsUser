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
      <div className='container-fluid page-header'>
        <h1>Your informations</h1>
        <p className="lead"> Before continuing to the app, fill these informations about you</p>
      </div>

      <div className='container page-content'>
        <form className='user-info'>
          <div className="form-group">
           <label htmlFor="firstNameInput">First Name</label>
           <input type="text" className="form-control" id='firstNameInput'/>
          </div>

          <div className="form-group">
           <label htmlFor="secondNameInput">Second Name</label>
           <input type="text" className="form-control" id='secondNameInput'/>
          </div>

          <div className="form-group">
           <label htmlFor="emailInput">Email address</label>
           <input type="email" className="form-control" id='emailInput'/>
          </div>

          <button onClick={this.sendUserInfo} type="button" className="btn pull-right"> REGISTER </button>
        </form>
        </div>
      </div>
    )
  }
});

module.exports = UserRegister;
