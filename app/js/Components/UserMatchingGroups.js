import React from 'react';

let sendInfoURL = 'http://108.168.180.148/userconfig/info/e6147626-d1ea-11e6-bf26-cec0c932ce01';

const UserMatchingGroups = React.createClass({

  render: function () {
    return (
      <div className='page-content'>
        <h2> Your matching groups </h2>
        <table className='table'>
          <thead>
            <tr>
              <th> Matching Group </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td> Renans List 1 </td>
              <td> <i className="material-icons">mode_edit</i> </td>
              <td> <i className="material-icons">delete</i> </td>
            </tr>
            <tr>
              <td> Renans List 1 </td>
            </tr>
            <tr>
              <td> Renans List 1 </td>
            </tr>
            <tr>
              <td> Renans List 1 </td>
            </tr>

          </tbody>

        </table>

        <button onClick={this.props.addMatchingGroup} type="button" className="btn"> ADD MATCHING GROUP </button>
      </div>
    )
  }
});

module.exports = UserMatchingGroups;
