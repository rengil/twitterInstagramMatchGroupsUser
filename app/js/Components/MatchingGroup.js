import React from 'react';

let sendInfoURL = 'http://108.168.180.148/userconfig/info/e6147626-d1ea-11e6-bf26-cec0c932ce01';
let userConfig = 'http://108.168.180.148/userconfig/';

const MatchingGroup = React.createClass({

  getInitialState:function () {
    return {
      matchGroupName: this.props.matchGroupName,
      actualTwitterMatchGroup: {},
      actualInstagramMatchGroup: {},
      othersTwitterMatchGroup: [],
      othersInstagramMatchGroup: []
    }
  },

  componentDidMount: function () {
    this.fetchMatchingGroups();
  },

  componentWillReceiveProps:function (nextProps) {
    this.setState({
      matchGroupName: nextProps.matchGroupName
    })

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
    let actualTwitterMatchGroup = {},
        actualInstagramMatchGroup = {},
        othersTwitterMatchGroup = [],
        othersInstagramMatchGroup = [];

    userConfig.twitterMatchGroups.map(function ( twitterMatch ) {

      if ( twitterMatch.name === this.state.matchGroupName ) {
        actualTwitterMatchGroup = twitterMatch;
        return;
      }
      othersTwitterMatchGroup.push(twitterMatch);

    }.bind(this));
    userConfig.instagramMatchGroups.map(function ( instagramMatch ) {
      if ( instagramMatch.name === this.state.matchGroupName ) {
        actualInstagramMatchGroup = instagramMatch;
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

  updateMatchingGroup: function () {
    let matchingGroupTwitter = Object.assign({} ,  this.state.actualTwitterMatchGroup);
    let matchingGroupInstagram = Object.assign({} ,  this.state.actualInstagramMatchGroup);
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

  addTwitterInfluencer: function () {
    let twitterMatchingGroup = Object.assign({}, this.state.actualTwitterMatchGroup);
    twitterMatchingGroup['influencers'].push('');
    this.setState({
      actualTwitterMatchGroup: twitterMatchingGroup}, function () {
        this.updateMatchingGroup()
      }
    )

  },

  addInstagramInfluencer: function () {
    let instagramMatchingGroup = Object.assign({}, this.state.actualInstagramMatchGroup);
    instagramMatchingGroup['influencers'].push('');
    this.setState({
      actualInstagramMatchGroup: instagramMatchingGroup}, function () {
        this.updateMatchingGroup()
      }
    )
  },

  onChangeTwitter: function (iterator, e) {
    let twitterMatchingGroup = Object.assign({}, this.state.actualTwitterMatchGroup);
    twitterMatchingGroup['influencers'][iterator] = e.target.value;
    this.setState({
      actualTwitterMatchGroup: twitterMatchingGroup}, function () {
        this.updateMatchingGroup()
      }
    )

  },

  onChangeInstagram: function (iterator, e) {
    let instagramMatchingGroup = Object.assign({}, this.state.actualInstagramMatchGroup);
    instagramMatchingGroup['influencers'][iterator] = e.target.value;
    this.setState({
      actualInstagramMatchGroup: instagramMatchingGroup}, function () {
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

        <div className='row matching-group'>
          <div className="col-md-4">
              <label  htmlFor="groupNameInput">Twitter Influencer</label>
              <i onClick={this.addTwitterInfluencer} className="material-icons clickable">add</i>
              {this.state.actualTwitterMatchGroup.influencers
                && this.state.actualTwitterMatchGroup.influencers.map(function (influencer, iterator) {
                return (<input type="text" onChange={this.onChangeTwitter.bind(this, iterator)}
                               className="form-control" value={influencer} />)
              }.bind(this))
              }

          </div>

          <div className="col-md-4">
              <label htmlFor="groupNameInput">Instagram Influencer</label>
              <i onClick={this.addInstagramInfluencer}  className="material-icons clickable">add</i>
              {this.state.actualInstagramMatchGroup.influencers
                && this.state.actualInstagramMatchGroup.influencers.map(function (influencer, iterator) {
                 return (<input onChange={this.onChangeInstagram.bind(this, iterator)} type="text" className="form-control" value={influencer}  />)
               }.bind(this))
              }
          </div>
        </div>

      </div>
    )
  }
});

module.exports = MatchingGroup;
