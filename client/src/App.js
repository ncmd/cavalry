import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Landing from './pages/landing';
import Status from './pages/status';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Post from './pages/post';
import Submit from './pages/submit';

class App extends Component {
    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Route exact path="/" component={Landing} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/signup" component={Signup} />
                        <Route exact path="/post" component={Post} />
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
