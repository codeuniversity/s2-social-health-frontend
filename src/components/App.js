import React, { Component } from 'react';
import './App.css';
import { Sidebar } from "../containers/Sidebar";
import { MessagesList } from "../containers/MessagesList";
import { AddMessage } from "../containers/AddMessage"


class App extends Component {
    render() {
        return (
            <div id="container">
                <section id="main">
                    <MessagesList />
                    <AddMessage />
                </section>
                <Sidebar />
            </div>
        )
    }
}

export default App;
