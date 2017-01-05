import React from 'react';

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
            influencers: [' '],
            keywords: [' ']
    };
    return matchGroup;
  },

  addMatchingGroup: function () {
    const uuid = this.getLocalStorageId();
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
                      [ ... this.props.userConfig.twitterMatchGroups || {},
                      this.getMatchGroup()
                    ],
                   "instagramMatchGroups":
                     [ ... this.props.userConfig.instagramMatchGroups || {},
                     this.getMatchGroup()
                   ]
                 }),
            })
            .then((response) => response)
            .then((response) => {
              this.props.onAddMatchingGroup("new matching group " + newMatchName);
              this.props.fetchMatchingGroups();
            });

    this.props.onAddMatchingGroup("new matching group " + newMatchName);
  },

  editMatchGroup: function (matchGroup) {
    this.props.editMatchGroup(matchGroup);
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
              {this.state.matchingGroups.map(function (matchingGroup){
              return (<tr>
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

module.exports = UserMatchingGroups;
