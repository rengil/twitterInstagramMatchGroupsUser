import React from 'react';

let sendInfoURL = 'http://108.168.180.148/userconfig/info/e6147626-d1ea-11e6-bf26-cec0c932ce01';

const MatchingGroup = React.createClass({

  render: function () {
    return (
      <div className='page-content'>
        <h2> Your matching group </h2>
        <form className='user-info'>

          <div className="form-group">
           <label htmlFor="groupNameInput">Group Name</label>
           <input type="text" className="form-control" id='groupNameInput'/>
          </div>

        </form>
      </div>
    )
  }
});

module.exports = MatchingGroup;
