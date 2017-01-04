import React from 'react';

let userConfig = 'http://108.168.180.148/userconfig/';

const UserMatchingGroups = React.createClass({

  getInitialState: function () {
    return {
        matchingGroups: [],
        loadedMatchingGroups: false,
        userConfig: undefined,
    }

  },

  componentDidMount: function () {
    this.fetchMatchingGroups();
  },

  fetchMatchingGroups: function ( ) {
    const uuid = this.getLocalStorageId();
    $.ajax({
       url: userConfig + uuid,
       contentType: "application/json",
       type: 'GET',
       success: (userConfig) => {
        this.setState({
          userConfig,
          loadedMatchingGroups: true
        });
        if (userConfig.twitterMatchGroups && userConfig.instagramMatchGroups) {
          this.getUserMatchingGroups(userConfig);
        }
       }
    });

  },

  getLocalStorageId: function () {
    return localStorage.getItem("id");
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
    })

  },

  getMatchGroup: function (name, influencer, keywords) {
    const newMatchName = this.state.matchingGroups.length + 1;
    var matchGroup = {
            name: "new matching group " + newMatchName,
            influencers: ["string"],
            keywords: ["string"]
    };
    return matchGroup;


  },

  addMatchingGroup: function () {
    const uuid = this.getLocalStorageId();
    const newMatchName = this.state.matchingGroups.length + 1;

    $.ajax({
           url: "http://108.168.180.148/userconfig/" + uuid,
           contentType: "application/json",
           type: 'PUT',
           data:  JSON.stringify({
              "twitterMatchGroups":
                 [ ... this.state.userConfig.twitterMatchGroups || {},
                 this.getMatchGroup()
               ],
              "instagramMatchGroups":
                [ ... this.state.userConfig.instagramMatchGroups || {},
                this.getMatchGroup()
              ]
            }),
           success: (response) => {
             this.props.onAddMatchingGroup("new matching group " + newMatchName);
             this.fetchMatchingGroups();
           }
        });

    this.props.onAddMatchingGroup("new matching group " + newMatchName);
  },

  render: function () {
    if (!this.state.loadedMatchingGroups) {
      return (<div> </div>)
    }
    return (
      <div className='page-content'>
        <h2> Your matching groups </h2>
        <div className='user-matching-groups'>
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
        </div>

        <button onClick={this.addMatchingGroup} type="button" className="btn"> ADD MATCHING GROUP </button>
      </div>
    )
  }
});

module.exports = UserMatchingGroups;
