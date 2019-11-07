import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import chatLoader from './images/chat-loader.svg';
import botAvatar from './images/pizza-avatar.svg';
import uuid from 'uuid'
import axio from 'axios'
import {GetAccessToken, ClaimSet} from "./googleAuth";

const { OAuth2Client } = require('google-auth-library');

class App extends React.Component {

    constructor(props) {
        super(props);

        const id = new uuid();
        const projectId = 'stone-column-256215';
        const serviceAccountEmail = 'dialogflow-mypfjy@stone-column-256215.iam.gserviceaccount.com';
        this.state = {
            id,
            projectId,
            serviceAccountEmail,
            serviceAccountPrivateKey,
            userMessages: [],
            botMessages: [],
            botGreeting: 'Hi, my name is NetworkBot! I can help you get pizza. Try typing something like \"I have a high server load.\" below.',
            botLoading: false,
        }
    }

    async ConvertSpeechToText(textString) {
        const claimSet = new ClaimSet(["https://www.googleapis.com/auth/cloud-platform"], 'dialogflow-mypfjy@stone-column-256215.iam.gserviceaccount.com');
        const accessToken = await GetAccessToken(claimSet,'-----BEGIN PRIVATE KEY-----\n' +
            'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCOEpaPs9EwUue2\n' +
            'Po4afjC74mszyo6qN56NxKMQ23+2LCxkkirDLHbYLf1OVN5vGRsJmiy9uurm2dM2\n' +
            'o6BDThIdryLJv3rZMq5FDlFqrTz1GRBCmDj8tOiegoc9qdlKR3lX3271eMsF4pkx\n' +
            'q6gipli2+PyJgWmh9jDa3QWru2ZSIiBQ8ob7+QH+Gazqp2TQkdgMl5sD5qdlcX/7\n' +
            'JSCVkugNKnG5ueN6YfjVTYB4mQzv7O8QeDDyxxIjgzr1mrFwtQHUN/pDsoq8UcRS\n' +
            'wD1OcKx+8bJT5AoHpYKemGBcEvS8+y45cd4j2xUJfGlkpmWZY4GLTzb+igHx5Gs8\n' +
            'fscGv2xRAgMBAAECggEABA4yR4xXvJQlQp3DAy0WeYqDSmFuFJxNVZknGXhWiy30\n' +
            'H3PPri4S/2VCrY19Ivk5vRquS8Ut5uSRY6YkkT9Fg5zn9o/VcyU/9b8sokmrK4jp\n' +
            'XqlHOSl12W56607xoa3sIA7D9VRbIUIgYttWS5Tpg+GUHd24lPO43cqA2q/ZAh+l\n' +
            '3MKvvEQdwk2mnvYPK5mNu/ZLvKdsYzw1dflRyvXjqbeWmwtOZHnYckafySxl/x8h\n' +
            '/WMmhRoecYXwRBYFHSaMDM/2tlhwJQnFbX7uiwHBeXRqaumf276q9q+M2KNK+cCG\n' +
            '9D+QlVwYmW5U+jGPlQGCbg6ITBSQALYW5d2IPPE3gQKBgQDGAVuFdWHRK7DK+0W2\n' +
            'RSCuEqnm8IFXMzVzy9bHcyyVKC7zbeSamrLPPs4IFoL48VrBLAsG7xGBjU6bgXg3\n' +
            'QrhfsYU54C6w+gjHiC2z1XJECWsWN/MjUNf4hHlTufUJOBjbmdlT4lsNni5xpALq\n' +
            'F0vM6J7GsX5Iia/myS8hN5eR8QKBgQC3r1blNKRBfl2r+B1pwlHiO+ILY4enwR7F\n' +
            'PZoffCTlTW2ToCzOBKI1CCvIMMwgCK4C/TXKFjuHQw4Yl0xtOX5vqNZT1Fss3EM+\n' +
            'pRi07ch1xcPu44WCqkcy8+flpC9Imcla1J7BWH/dD/iORuB6GK0lwwYN5SHhq4UA\n' +
            'KcRt8kMgYQKBgCwPK0VULFL2DN3t8cIwOahiYMoRpEY6D9/XcNBq0XXTPjdOsbqx\n' +
            'R66UBBaKo9QvKImpej6tvdB9GAvEUHLDdvFcOA/70Yfx6zgzFjBZA5ceHWURSBoI\n' +
            'qDYVjEXUMDE/+VAMOO7QhIBQPXduDnP2gRh0frgp0LblZG3PQJx8mU6RAoGBAJhb\n' +
            'CDFPS5rDTMDyKLtrIW4MC380y/U5+uLRKMBKwXOsmGHlbqRnNX/VSjNfPkCn0mXK\n' +
            'Ts5TSIb1+IAvJoZGNPg6y6N2tTVtcR1J5UdVH3uIUO8ZqsjpoerCYiuY1ltaq6f6\n' +
            'Sb/HPy9GKv0gDttXEm8K5z+pOUQsd0HeYv5q/oChAoGBAKFOHwIcuEezQkZnze0y\n' +
            'bpwGhCXaMJ6aDAMxXq/MpXvQ+3zDZoJll14Fl8y+tUJjmDcr0KBXyWucXYOuQ6wx\n' +
            'JTiqY0bQlnLEJkQGMkJhcbWFX6Ek3x8R68drOo9tUC87zV5WZVCYaaLNcObffyxS\n' +
            'Nr2CPZVR3Uxv+xnj4LeHStlX\n' +
            '-----END PRIVATE KEY-----\n');
        const response = await fetch(`https://dialogflow.googleapis.com/v2beta1/projects/${this.state.projectId}/agent/sessions/${this.state.id}:detectIntent`, {
            method: "POST",
            headers: {
                authorization: `Bearer ${accessToken}`,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                queryInput: {
                    text: {
                        text:   textString,
                        languageCode: "en",
                    },
                },
            }),
        });

        const responseJSON = await response.json();
        console.log("Got responseJSON: ", responseJSON);
        debugger;
        const speechText = responseJSON.queryResult.queryText || "";
        return speechText;
    }

    updateUserMessages = (newMessage) => {

        // Create a new array from current user messages
        var updatedUserMessagesArr = this.state.userMessages;

        // Create a new array from current bot messages
        var updatedBotMessagesArr = this.state.botMessages;

        // Render user message and bot's loading message
        this.setState({
            userMessages: updatedUserMessagesArr.concat(newMessage),
            botLoading: true,
        })

        // Get the request to DialogFlow in a nice little package with the user's message
        let responseBot = this.ConvertSpeechToText(newMessage)
        console.log('BOT RESPONSE:', responseBot);
        // End conversation once user hits end flag in API
        debugger;
        var botResponse = responseBot;
        // Update state with both user and bot's latest messages
        this.setState({
            botMessages: updatedBotMessagesArr.concat(botResponse),
            botLoading: false,
        })
    }

    showMessages() {

        var userConvo = this.state.userMessages;

        // Show initial bot welcome message
        if (this.state.userMessages.length === 0) {
            return 
        }
        
        var updatedConvo = userConvo.map((data, index)=>{

            var botResponse = this.state.botMessages[index];
            
            return (
                <div className="conversation-pair" key={'convo' + index}> 
                    <UserBubble message={data} key={'u'+index} />
                    <BotBubble message={botResponse} key={'b'+index} />
                </div>
            )
        });

        return updatedConvo;
        
    }

    render() {
        this.auth();
        return (
            <div id="app-container">
               
                <div className="convo-container">
                    <BotBubble message={this.state.botGreeting} key="bot-00" />
                    {this.showMessages()}
                </div>
                <UserInput userMessage = {this.state.userMessage} updateUserMessages = {this.updateUserMessages} />
            </div>
            
        )
    }
}

class UserBubble extends React.Component {

    render() {

        return (
            <div className="user-message-container">
                <div className="chat-bubble user">{this.props.message}</div>
            </div>
        )
    }
}


class BotBubble extends React.Component {

    componentDidMount = () => {

        var lastBubble = this.refs.chatBubble;
        lastBubble.scrollIntoView(true);
    }

    render() {

        let svgLoader = <img className="loader" src={chatLoader} alt="loading icon" />

        return (
            <div className="bot-message-container">
                <div className="img-avatar-container">
                    <img className="bot-avatar" src={botAvatar} alt="bot avatar" />
                </div>
                <div>
                    <div className="chat-bubble bot" ref="chatBubble">{this.props.message ? this.props.message : svgLoader}</div>
                    <TimeStamp />
                </div>
            </div>
            
        )
    }
}

class TimeStamp extends React.Component {

    shouldComponentUpdate = () => {
        return false;
    }

    getTimeStamp = () => {
        var time = new Date(); // create a new Date object
        
        // Format date in 12 hour format (AM/PM) using 'toLocaleString'
        var formattedDate = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        return formattedDate;
    }

    render() {
        return (
            <div className="time-stamp">{this.getTimeStamp()}</div>
        )
    }
    
}

class UserInput extends React.Component {

    componentDidMount = () => {
        this.chatInput.focus(); // focus automatically on input on page load
        console.log('componentDidMount > UserInput');
    }

    handleChange = (event) => {

        console.log('handleClick triggered');
        if (this.chatInput.value !== '') { // checking for empty input
            if (event.key === 'Enter') {
                var userInput = this.chatInput.value;
    
                // update state on parent component
                this.props.updateUserMessages(userInput);
                event.target.value = '';
            }
        }

        return;
        
    }

    handleClick = (event) => {

        if (this.chatInput.value !== '') { // checking for empty input
            var userInput = this.chatInput.value;

            // update state on parent component
            this.props.updateUserMessages(userInput);
            this.chatInput.value = '';
            this.chatInput.focus(); // focus automatically on input on page load
        }

        return;

    }
    
    render() {

        var submitIcon = <svg onClick={this.handleClick} id="submit-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 500 500"><g><g><polygon fill="#7c7c82" points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75"></polygon></g></g></svg>

        return (
            <div className="input-wrapper">
                <div className="input-container">
                    <input id="chat" ref={(input) => { this.chatInput = input; }} type="text" onKeyPress={this.handleChange} placeholder="Type and press 'enter' to chat" />
                    {submitIcon}
                </div>
            </div>

        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));