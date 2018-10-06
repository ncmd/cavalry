import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from './views/landing';
import Status from './views/status';
import Login from './views/login';
import Signup from './views/signup';
import Dashboard from './views/dashboard';
import Post from './views/post';
import Edit from './views/edit';
import Submit from './views/submit';
import Manage from './views/manage';
import Request from './views/request';
import Activity from './views/activity';
import Team from './views/team';
import Subscription from './views/subscription';
import PasswordReset from './views/passwordreset';
// import { connect } from 'react-redux';

class App extends Component {

    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Route exact path="/" component={Landing} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/signup" component={Signup} />
                        <Route exact path="/manage" component={Manage} />
                        <Route exact path="/subscription" component={Subscription} />
                        <Route exact path="/request" component={Request} />
                        <Route exact path="/activity" component={Activity} />
                        <Route exact path="/team" component={Team} />
                        <Route path="/reset" component={PasswordReset} />
                        <Route
                          exact
                          path="/post/:postId/:postTitle"
                          component={Post}
                        />
                        <Route
                          exact
                          path="/post/:postId/:postTitle/edit"
                          component={Edit}
                        />
                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/status" component={Status} />
                        <Route exact path="/submit" component={Submit} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}


export default App;
