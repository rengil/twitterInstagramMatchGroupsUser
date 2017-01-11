import React from 'react';
var fetch = require('node-fetch');

let sendInfoURL = 'http://108.168.180.148/userconfig/info/e6147626-d1ea-11e6-bf26-cec0c932ce01';
let userConfig = 'http://108.168.180.148/userconfig/';

/**
 * Represents a specif matching group that will be edited or have been just added
 *
 * @class MatchingGroup
 */

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
    this.fetchMatchingGroups();
  },

  componentWillReceiveProps:function (nextProps) {
    const shouldFetch = this.state.matchGroupName !== nextProps.matchGroupName;

    this.setState({
      matchGroupName: nextProps.matchGroupName
    })

    if(shouldFetch){
    this.fetchMatchingGroups();
    }

  },

  /**
   * GET the user info and call the splitThisMatchingGroupsFromOthers
   * @function fetchMatchingGroups
   * @author Renan Lazarini Gil
  * @memberOf MatchingGroup
   */
  fetchMatchingGroups: function ( ) {

    const uuid = this.getLocalStorageId();

    fetch(userConfig + uuid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
        })
        .then((response) => response.json())
        .then((userConfig) => {
            this.splitThisMatchingGroupsFromOthers(userConfig);

    });


  },

  /**
   * Get the local Storage UUID
   * @function getLocalStorageId
   * @author Renan Lazarini Gil
  * @memberOf MatchingGroup
   */
  getLocalStorageId: function () {
    return localStorage.getItem("id");
  },

  /**
   * Split in two ways the data. First the actual data from the others. Second, the
   * instagram from the twitter. This will be used to save the data
   * @function splitThisMatchingGroupsFromOthers
   * @author Renan Lazarini Gil
  * @param object userConfig - All matching group user data
  * @memberOf MatchingGroup
   */
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

  /**
   * fetch the twitter and instagram data, joining the changed info with the others info
   * @function updateMatchingGroup
   * @author Renan Lazarini Gil
   * @memberOf MatchingGroup
   */
  updateMatchingGroup: function (mustReloadGroups) {
    let _this = this;

    const uuid = this.getLocalStorageId();

    fetch("http://108.168.180.148/userconfig/" + uuid, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
               "twitterMatchGroups":
                  [ ... _this.state.othersTwitterMatchGroup || {},
                  this.state.actualTwitterMatchGroup
                ],
               "instagramMatchGroups":
                 [ ... _this.state.othersInstagramMatchGroup || {},
                 this.state.actualInstagramMatchGroup
               ]
             }),
        })
        .then((response) => response)
        .then((response) => {
          if (mustReloadGroups) {
            this.props.fetchMatchingGroups();
          }
        });
  },
  /**
   * fetch the twitter and instagram data, joining the changed info with the others info
   * @function onChangeName
   * @author Renan Lazarini Gil
   * @method event - event to get the target.value
   * @memberOf MatchingGroup
   */
  onChangeName: function (event) {
    let instagramMatchingGroup = Object.assign({}, this.state.actualInstagramMatchGroup);
    instagramMatchingGroup['name'] = event.target.value;
    let twitterMatchingGroup = Object.assign({}, this.state.actualTwitterMatchGroup);
    twitterMatchingGroup['name'] = event.target.value;

    if (this.state.changingName) {
        clearTimeout(this.state.changingName);
    }

    this.setState({
        actualInstagramMatchGroup: instagramMatchingGroup,
        actualTwitterMatchGroup: twitterMatchingGroup,
        changingName:   setTimeout( ()  => {
            this.updateMatchingGroup(true);
        }, 750)
      }
    )
  },

  /**
   * adds a new twitter influencer.
   * @function addTwitterInfluencer
   * @author Renan Lazarini Gil
   * @memberOf MatchingGroup
   */
  addTwitterInfluencer: function () {
    let twitterMatchingGroup = Object.assign({}, this.state.actualTwitterMatchGroup);
    twitterMatchingGroup['influencers'].push('');
    this.setState({
      actualTwitterMatchGroup: twitterMatchingGroup}, function () {
        this.updateMatchingGroup()
      }
    )

  },

  /**
   * adds a new instagram influencer.
   * @function addInstagramInfluencer
   * @author Renan Lazarini Gil
   * @memberOf MatchingGroup
   */
  addInstagramInfluencer: function () {
    let instagramMatchingGroup = Object.assign({}, this.state.actualInstagramMatchGroup);
    instagramMatchingGroup['influencers'].push('');
    this.setState({
      actualInstagramMatchGroup: instagramMatchingGroup}, function () {
        this.updateMatchingGroup()
      }
    )
  },

  /**
   * adds a new keywords.
   * @function addKeywords
   * @author Renan Lazarini Gil
   * @memberOf MatchingGroup
   */
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

  /**
   * on change any of the twitter influencer
   * @function onChangeTwitter
   * @author Renan Lazarini Gil
   * @memberOf MatchingGroup
   */
  onChangeTwitter: function (iterator, e) {
    let twitterMatchingGroup = Object.assign({}, this.state.actualTwitterMatchGroup);
    twitterMatchingGroup['influencers'][iterator] = e.target.value;

    if (this.state.changingTwitter) {
        clearTimeout(this.state.changingTwitter);
    }

    this.setState({
      actualTwitterMatchGroup: twitterMatchingGroup,
      changingTwitter:   setTimeout( ()  => {
          this.updateMatchingGroup(true);
      }, 750)
    });
  },

  /**
   * on change any of the instagram influencer
   * @function onChangeInstagram
   * @author Renan Lazarini Gil
   * @memberOf MatchingGroup
   */
  onChangeInstagram: function (iterator, e) {
    let instagramMatchingGroup = Object.assign({}, this.state.actualInstagramMatchGroup);
    instagramMatchingGroup['influencers'][iterator] = e.target.value;

    if (this.state.changingInstagram) {
        clearTimeout(this.state.changingInstagram);
    }

    this.setState({
      actualInstagramMatchGroup: instagramMatchingGroup,
      changingInstagram:   setTimeout( ()  => {
          this.updateMatchingGroup(true);
      }, 750)
    });
  },

  /**
   * on change any of the keywords
   * @function onChangeKeywords
   * @author Renan Lazarini Gil
   * @memberOf MatchingGroup
   */
  onChangeKeywords: function (iterator, e) {
    let instagramMatchingGroup = Object.assign({}, this.state.actualInstagramMatchGroup);
    instagramMatchingGroup['keywords'][iterator] = e.target.value;

    let twitterMatchingGroup = Object.assign({}, this.state.actualTwitterMatchGroup);
    twitterMatchingGroup['keywords'][iterator] = e.target.value;

    if (this.state.changingKeywords) {
        clearTimeout(this.state.changingKeywords);
    }

    this.setState({
      actualInstagramMatchGroup: instagramMatchingGroup,
      changingKeywords:   setTimeout( ()  => {
          this.updateMatchingGroup(true);
      }, 750)
    });
  },

  preventOnChange: function () {

  },

  render: function () {
    return (
      <div className='page-content'>
        <h2> Your matching group </h2>
        <form className='user-info'>

          <div className="form-group">
           <label htmlFor="groupNameInput">Group Name</label>
           <input value={this.state.actualTwitterMatchGroup.name}
                  onChange={this.preventOnChange}
                  onKeypress={this.onChangeName}
                  onPaste={this.onChangeName}
                  onInput={this.onChangeName}
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
                return (<input key={'twitter' + iterator}
                               type="text" onChange={this.preventOnChange}
                               onInput={this.onChangeTwitter.bind(this, iterator)}
                               onKeypress={this.onChangeTwitter.bind(this, iterator)}
                               onPaste={this.onChangeTwitter.bind(this, iterator)}
                               className="form-control" value={influencer} />)
              }.bind(this))
              }
              <div onClick={this.addTwitterInfluencer} className='icon-text-clickable'> <i className="material-icons clickable">add</i> <span> Add </span> </div>

          </div>

          <div className="col-md-4">
              <label htmlFor="groupNameInput">Instagram Influencer</label>

              {this.state.actualInstagramMatchGroup.influencers
                && this.state.actualInstagramMatchGroup.influencers.map(function (influencer, iterator) {
                 return (<input key={'instagram' + iterator}
                               onChange={this.preventOnChange}
                               onInput={this.onChangeInstagram.bind(this, iterator)}
                               onKeypress={this.onChangeInstagram.bind(this, iterator)}
                               onPaste={this.onChangeInstagram.bind(this, iterator)}
                               type="text" className="form-control"
                               value={influencer}  />)
               }.bind(this))
              }
              <div onClick={this.addInstagramInfluencer} className='icon-text-clickable'> <i className="material-icons clickable">add</i> <span> Add </span> </div>
          </div>

          <div className="col-md-4">
              <label htmlFor="groupNameInput">Keywords</label>

              {this.state.actualInstagramMatchGroup.keywords
                && this.state.actualInstagramMatchGroup.keywords.map(function (keyword, iterator) {
                 return (<input key={'keywords' + iterator}
                               onChange={this.preventOnChange}
                               onInput={this.onChangeKeywords.bind(this, iterator)}
                               onKeypress={this.onChangeKeywords.bind(this, iterator)}
                               onPaste={this.onChangeKeywords.bind(this, iterator)}
                                type="text" className="form-control"
                                value={keyword}  />)
               }.bind(this))
              }
              <div onClick={this.addKeywords} className='icon-text-clickable'> <i className="material-icons clickable">add</i> <span> Add </span> </div>
          </div>

        </div>

      </div>
    )
  }
});

MatchingGroup.defaultProps = {
  matchGroupName: [],
}

module.exports = MatchingGroup;
