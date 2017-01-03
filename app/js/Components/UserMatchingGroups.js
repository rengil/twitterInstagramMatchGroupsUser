import React from 'react';

let sendInfoURL = 'http://108.168.180.148/userconfig/info/e6147626-d1ea-11e6-bf26-cec0c932ce01';

const UserMatchingGroups = React.createClass({

  render: function () {
    return (
      <div>
      <div className='container-fluid page-header'>
        <h1>Your Matching Groups</h1>
        <p className="lead"> Here you can add a matching group</p>
      </div>
        Hora de testar os matching groups
      </div>
    )
  }
});

module.exports = UserMatchingGroups;
