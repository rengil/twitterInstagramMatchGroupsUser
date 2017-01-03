import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, browserHistory } from 'react-router'
import UserRegister from './Components/UserRegister';

render((
  <Router history={browserHistory}>
    <Route path="/" component={UserRegister}> </Route>
  </Router>
), document.getElementById('content'))
