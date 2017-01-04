import React from 'react';

let userConfig = 'http://108.168.180.148/userconfig/00000001-0002-0003-0004-000000000005';

const UserMatchingGroups = React.createClass({

  getInitialState: function () {
    return {
        matchingGroups: [],
        loadedMatchingGroups: false
    }

  },

  componentDidMount: function () {
    $.ajax({
       url: userConfig,
       contentType: "application/json",
       type: 'GET',
       success: (userConfig) => {
        this.setState({
          userConfig
        });
        this.getUserMatchingGroups(userConfig);
       }
    });
  },

  getUserMatchingGroups: function (userConfig) {
    let groupSet = new Set();
    userConfig.twitterMatchGroups.map(function ( twitterMatch ) {
      groupSet.add(twitterMatch.name);
    });
    userConfig.instagramMatchGroups.map(function ( instagramMatch ) {
      groupSet.add(instagramMatch.name);
    });
    this.setState({
      matchingGroups: [...groupSet],
      loadedMatchingGroups: true
    })

  },

  render: function () {
    if (!this.state.loadedMatchingGroups) {
      return (<div> </div>)
    }
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
            {this.state.matchingGroups.map(function (matchingGroup){
            return (<tr>
              <td> {matchingGroup} </td>
              <td> <i className="material-icons clickable">mode_edit</i> </td>
              <td> <i className="material-icons clickable">delete</i> </td>
            </tr>)
          })
          }
          </tbody>

        </table>

        <button onClick={this.props.addMatchingGroup} type="button" className="btn"> ADD MATCHING GROUP </button>
      </div>
    )
  }
});

module.exports = UserMatchingGroups;
