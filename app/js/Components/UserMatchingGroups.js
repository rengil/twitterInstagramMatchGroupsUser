import React from 'react';
var fetch = require('node-fetch');

/**
 * Represents a list of matching group and action of adding another one
 *
 * @class UserMatchingGroups
 */
let userConfig = 'http://108.168.180.148/userconfig/';

const UserMatchingGroups = React.createClass({

  getInitialState: function () {
    return {
        matchingGroups: [],
    }

  },

  componentDidMount: function () {
    if (this.props.userConfig && this.props.userConfig.twitterMatchGroups && this.props.userConfig.instagramMatchGroups) {
      this.getUserMatchingGroups(this.props.userConfig);
    }
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.userConfig && nextProps.userConfig.twitterMatchGroups && nextProps.userConfig.instagramMatchGroups) {
      this.getUserMatchingGroups(nextProps.userConfig);
    }

  },
  /**
   * get the local storage
   * @function getLocalStorageId
   * @author Renan Lazarini Gil
   * @memberOf UserMatchingGroups
   */
  getLocalStorageId: function () {
    return localStorage.getItem("id");
  },

  /**
   * gets the union with no repetition of the Instagram and Twitter influencers
   * @function getUserMatchingGroups
   * @author Renan Lazarini Gil
   * @param (string) userConfig : the user information
   * @memberOf UserMatchingGroups
   */
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
    })

  },

  /**
   * get the new matching group to be inserted
   * @function getMatchGroup
   * @author Renan Lazarini Gil
   * @memberOf UserMatchingGroups
   */
  getMatchGroup: function () {
    const newMatchName = this.state.matchingGroups.length + 1;
    var matchGroup = {
            name: "new matching group " + newMatchName,
            influencers: [' '],
            keywords: [' ']
    };
    return matchGroup;
  },

  /**
   * insert a new match group. For both the Instagram and Twitter JSON
   * @function addMatchingGroup
   * @author Renan Lazarini Gil
   * @memberOf UserMatchingGroups
   */
  addMatchingGroup: function () {
    const uuid = this.getLocalStorageId();

    fetch(userConfig + uuid, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
        })
        .then((response) => response.json())
        .then((userConfig) => {
            this.fetchAddMatchingGroup(uuid, userConfig);

      })


  },

  fetchAddMatchingGroup: function (uuid, userConfig) {
    const newMatchName = this.state.matchingGroups.length + 1;
    fetch("http://108.168.180.148/userconfig/" + uuid, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin', // you need to add this line
            body: JSON.stringify({
               "twitterMatchGroups":
                  [ ... userConfig.twitterMatchGroups || {},
                  this.getMatchGroup()
                ],
               "instagramMatchGroups":
                 [ ... userConfig.instagramMatchGroups || {},
                 this.getMatchGroup()
               ]
             }),
        })
        .then((response) => response)
        .then((response) => {
          this.props.openMatchingGroup("new matching group " + newMatchName);
          this.props.fetchMatchingGroups();
        });
  },

  /**
   * open a the user matching group for editing. Renders the MatchingGroup component
   * @function editMatchGroup
   * @author Renan Lazarini Gil
   * @memberOf UserMatchingGroups
   */
  editMatchGroup: function (matchGroup) {
    this.props.openMatchingGroup(matchGroup);
  },

  render: function () {
    if (!this.state.matchingGroups) {
      return (<div> </div>)
    }
    return (
      <div className='page-content user-matching-groups'>
        <h2> Your matching groups </h2>
        <div className='groups'>
          <table className='table'>
            <thead>
              <tr>
                <th>  </th>
              </tr>
            </thead>

            <tbody>
              {this.state.matchingGroups.map(function (matchingGroup, iterator){
              return (<tr key={'matching-group' + iterator}>
                <td> {matchingGroup} </td>
                <td> <i onClick={this.editMatchGroup.bind(this, matchingGroup)} className="material-icons clickable">mode_edit</i> </td>
              </tr>)
            }.bind(this))
            }
            </tbody>

          </table>
        </div>

        <button onClick={this.addMatchingGroup} type="button"> ADD MATCHING GROUP </button>
      </div>
    )
  }
});

UserMatchingGroups.defaultProps = {
  userConfig: [],
  openMatchingGroup: function () {},
  fetchMatchingGroups: function () {}
}

module.exports = UserMatchingGroups;
