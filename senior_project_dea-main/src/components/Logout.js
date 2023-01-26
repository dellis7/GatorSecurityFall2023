import React, { Component } from 'react'

class Logout extends Component {
    render() {
        return (<>Signing out...</>);
    }

    componentDidMount() {
        window.localStorage.removeItem("token");
        window.location.href = "./sign-in";
    }
}

export default Logout;