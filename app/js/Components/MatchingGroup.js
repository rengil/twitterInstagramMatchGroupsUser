import React from 'react';

let sendInfoURL = 'http://108.168.180.148/userconfig/info/e6147626-d1ea-11e6-bf26-cec0c932ce01';
let userConfig = 'http://108.168.180.148/userconfig/';

const MatchingGroup = React.createClass({

  getInitialState:function () {
    return {
      matchGroupName: this.props.matchGroupName,
      actualTwitterMatchGroup: {},
      actualInstagramMatchGroup: {},
      actualKeywords: {},
      othersTwitterMatchGroup: [],
      othersInstagramMatchGroup: []
    }
  },

  componentDidMount: function () {
    this.scrollAnimation();
    this.fetchMatchingGroups();
  },

  componentWillReceiveProps:function (nextProps) {
    this.setState({
      matchGroupName: nextProps.matchGroupName
    })

    //this.scrollAnimation();
    this.fetchMatchingGroups();
  },

  scrollAnimation: function () {
    var doc = document.getElementById('matching-group');
    var rect = doc.getBoundingClientRect();
    var body = $("html, body");
    $("html, body").animate({ scrollTop: rect.top}, 200)
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
      actualTwitterMatchGroup,
      actualInstagramMatchGroup,
      othersTwitterMatchGroup,
      othersInstagramMatchGroup
    })

  },

  updateMatchingGroup: function () {
    let _this = this;

    const uuid = this.getLocalStorageId();

    $.ajax({
           url: "http://108.168.180.148/userconfig/" + uuid,
           contentType: "application/json",
           type: 'PUT',
           data:  JSON.stringify({
              "twitterMatchGroups":
                 [ ... _this.state.othersTwitterMatchGroup || {},
                 this.state.actualTwitterMatchGroup
               ],
              "instagramMatchGroups":
                [ ... _this.state.othersInstagramMatchGroup || {},
                this.state.actualInstagramMatchGroup
              ]
            }),
           success: (response) => {

           }
    });
  },

  onChangeName: function (inputName, event) {
    let instagramMatchingGroup = Object.assign({}, this.state.actualInstagramMatchGroup);
    instagramMatchingGroup['name'] = event.target.value;
    let twitterMatchingGroup = Object.assign({}, this.state.actualTwitterMatchGroup);
    twitterMatchingGroup['name'] = event.target.value;

    this.setState({
      actualInstagramMatchGroup: instagramMatchingGroup, actualTwitterMatchGroup: twitterMatchingGroup}, function () {
        this.updateMatchingGroup();
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

  addKeywords: function () {
    let instagramMatchingGroup = Object.assign({}, this.state.actualInstagramMatchGroup);
    instagramMatchingGroup['keywords'].push('');
    let twitterMatchingGroup = Object.assign({}, this.state.actualTwitterMatchGroup);
    twitterMatchingGroup['keywords'].push('');
    this.setState({
      actualInstagramMatchGroup: instagramMatchingGroup, actualTwitterMatchGroup: twitterMatchingGroup }, function () {
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

  onChangeKeywords: function (iterator, e) {
    let instagramMatchingGroup = Object.assign({}, this.state.actualInstagramMatchGroup);
    instagramMatchingGroup['keywords'][iterator] = e.target.value;
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
           <input value={this.state.actualTwitterMatchGroup.name}
                  onChange={this.onChangeName.bind(this, 'matchGroupName')}
                  type="text"
                  className="form-control"
                  id='groupNameInput'/>
          </div>
        </form>

        <div className='row matching-group'>
          <div className="col-md-4">
              <label  htmlFor="groupNameInput">Twitter Influencer</label>

              {this.state.actualTwitterMatchGroup.influencers
                && this.state.actualTwitterMatchGroup.influencers.map(function (influencer, iterator) {
                return (<input type="text" onChange={this.onChangeTwitter.bind(this, iterator)}
                               className="form-control" value={influencer} />)
              }.bind(this))
              }
              <div onClick={this.addTwitterInfluencer} className='icon-text-clickable'> <i className="material-icons clickable">add</i> <span> Add </span> </div>

          </div>

          <div className="col-md-4">
              <label htmlFor="groupNameInput">Instagram Influencer</label>

              {this.state.actualInstagramMatchGroup.influencers
                && this.state.actualInstagramMatchGroup.influencers.map(function (influencer, iterator) {
                 return (<input onChange={this.onChangeInstagram.bind(this, iterator)} type="text" className="form-control" value={influencer}  />)
               }.bind(this))
              }
              <div onClick={this.addInstagramInfluencer} className='icon-text-clickable'> <i className="material-icons clickable">add</i> <span> Add </span> </div>
          </div>

          <div className="col-md-4">
              <label htmlFor="groupNameInput">Keywords</label>

              {this.state.actualInstagramMatchGroup.keywords
                && this.state.actualInstagramMatchGroup.keywords.map(function (keyword, iterator) {
                 return (<input onChange={this.onChangeKeywords.bind(this, iterator)} type="text" className="form-control" value={keyword}  />)
               }.bind(this))
              }
              <div onClick={this.addKeywords} className='icon-text-clickable'> <i className="material-icons clickable">add</i> <span> Add </span> </div>
          </div>

        </div>

      </div>
    )
  }
});

module.exports = MatchingGroup;
