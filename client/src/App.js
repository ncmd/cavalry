import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Status from './pages/status';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Post from './pages/post';
import Edit from './pages/edit';
import Submit from './pages/submit';
import Manage from './pages/manage';
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
