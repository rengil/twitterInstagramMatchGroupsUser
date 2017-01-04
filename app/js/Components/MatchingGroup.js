import React from 'react';

let sendInfoURL = 'http://108.168.180.148/userconfig/info/e6147626-d1ea-11e6-bf26-cec0c932ce01';
let userConfig = 'http://108.168.180.148/userconfig/';

const MatchingGroup = React.createClass({

  getInitialState:function () {
    return {
      matchGroupName: this.props.matchGroupName,
      actualTwitterMatchGroup: [],
      actualInstagramMatchGroup: [],
      othersTwitterMatchGroup: [],
      othersInstagramMatchGroup: []
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
          this.splitThisMatchingGroupsFromOthers(userConfig);
       }
    });

  },

  getLocalStorageId: function () {
    return localStorage.getItem("id");
  },

  splitThisMatchingGroupsFromOthers: function (userConfig) {
    let groupSet = new Set();
    let actualTwitterMatchGroup = [],
        actualInstagramMatchGroup = [],
        othersTwitterMatchGroup = [],
        othersInstagramMatchGroup = [];

    userConfig.twitterMatchGroups.map(function ( twitterMatch ) {

      if ( twitterMatch.name === this.state.matchGroupName ) {
        actualTwitterMatchGroup.push(twitterMatch);
        return;
      }
      othersTwitterMatchGroup.push(twitterMatch);

    }.bind(this));
    userConfig.instagramMatchGroups.map(function ( instagramMatch ) {
      if ( instagramMatch.name === this.state.matchGroupName ) {
        actualInstagramMatchGroup.push(instagramMatch);
        return;
      }
      othersInstagramMatchGroup.push(instagramMatch);
    }.bind(this));

    this.setState({
      matchingGroups: [...groupSet],
      actualTwitterMatchGroup,
      actualInstagramMatchGroup,
      othersTwitterMatchGroup,
      othersInstagramMatchGroup
    })

  },

  componentWillReceiveProps:function (nextProps) {
    this.setState({
      matchGroupName: nextProps.matchGroupName
    })
  },

  updateMatchingGroup: function () {
    let matchingGroupTwitter = Object.assign({} , ... this.state.actualTwitterMatchGroup);
    let matchingGroupInstagram = Object.assign({} , ...  this.state.actualInstagramMatchGroup);
    let _this = this;

    matchingGroupTwitter['name'] = this.state.matchGroupName;
    matchingGroupInstagram['name'] = this.state.matchGroupName;

    const uuid = this.getLocalStorageId();

    $.ajax({
           url: "http://108.168.180.148/userconfig/" + uuid,
           contentType: "application/json",
           type: 'PUT',
           data:  JSON.stringify({
              "twitterMatchGroups":
                 [ ... _this.state.othersTwitterMatchGroup || {},
                 matchingGroupTwitter
               ],
              "instagramMatchGroups":
                [ ... _this.state.othersInstagramMatchGroup || {},
                matchingGroupInstagram
              ]
            }),
           success: (response) => {

           }
    });
  },

  onChangeInput: function (inputName, event) {
    const newState = Object.assign({},this.state);
    const _this = this;
    newState[inputName] = event.target.value;
    this.setState(
      newState, function () {
        this.updateMatchingGroup()
      }
    )
  },

  render: function () {
    return (
      <div className='page-content'>
        <h2> Your matching group </h2>
        <form className='user-info'>

          <div className="form-group">
           <label htmlFor="groupNameInput">Group Name</label>
           <input value={this.state.matchGroupName}
                  onChange={this.onChangeInput.bind(this, 'matchGroupName')}
                  type="text"
                  className="form-control"
                  id='groupNameInput'/>
          </div>

        </form>
      </div>
    )
  }
});

module.exports = MatchingGroup;
