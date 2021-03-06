import React, { Component, Fragment } from 'react';
import { Launcher } from 'react-chat-window';
import { connect } from 'react-redux';
import LoadingSpinner from 'src/common/loadingSpinner/LoadingSpinner';
import {
  agentProfile,
  updateStatusOfChatSocket,
  getStatusOfChatSocket,
} from 'src/modules/chat';
import 'src/static/stylesheets/chat.css';
import ReactDOM from 'react-dom';
import { WEB_SOCKET_CHAT } from 'src/constants';

class ChatWidget extends Component {
  constructor() {
    super();
    this.state = {
      messageList: [],
      newMessagesCount: 0,
      isOpen: false,
      loading: false,
      isBotAvailable: true,
      isConfirmState: false,
      confirmType: null,
    };
    this.chatSocket = null;
    this.current_command = null;
    this.commands = {
      START_NEW_SESSION: 'newsession',
      REQUEST_LAST_SESSION_DATA: 'getlastsession',
      CHAT: 'chat',
    };
    this.response_types = {
      LAST_SESSION_MESSAGES: 'last_session_messages',
      FORCE_NEW_SESSION: 'force_new_session',
      CHAT_RESPONSE: 'chat_response',
      START_NEW_SESSION_FAILED: 'new_session_failed',
      END_SESSION_STATUS: 'end_session_status',
      ERROR: 'error',
    };
  }

  _onMessageWasSent = (message) => {
    if (this.state.isBotAvailable) {
      let text = message.data.text;
      if (text) {
        // Chat handle
        this.send_websocket_command(this.commands.CHAT, text.trim());
        this.setState({
          messageList: [...this.state.messageList, message],
        });
      }
    }
  };

  _handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen,
      newMessagesCount: 0,
    });
  };

  _sendMessage = (text) => {
    if (text && text.length > 0) {
      const newMessagesCount = this.state.isOpen
        ? this.state.newMessagesCount
        : this.state.newMessagesCount + 1;
      this.setState({
        newMessagesCount: newMessagesCount,
        messageList: [
          ...this.state.messageList,
          {
            author: 'them',
            type: 'text',
            data: { text },
          },
        ],
      });
    }
  };

  _sendMessages = (textArr) => {
    if (textArr && textArr.length > 0) {
      let messages = [];
      for (var i = 0, l = textArr.length; i < l; i++) {
        messages.push({
          type: 'text',
          author: 'them',
          data: {
            text: textArr[i],
          },
        });
      }
      const newMessagesCount = this.state.isOpen
        ? this.state.newMessagesCount
        : this.state.newMessagesCount + textArr.length;
      this.setState({
        newMessagesCount: newMessagesCount,
        messageList: [...this.state.messageList, ...messages],
      });
    }
  };

  create_websocket_connection = () => {
    let _self = this;
    _self.setState({
      loading: true,
    });
    let chatSocket;
    try {
      chatSocket = new WebSocket(WEB_SOCKET_CHAT);
    } catch (err) {
      return null;
    }
    chatSocket.onopen = function (e) {
      console.log('[chat_open] Connected to chatbot');
      _self.props.updateStatusOfChatSocket(true);
      _self.setState({
        loading: false,
      });
      _self.confirmMessage();
    };
    chatSocket.onmessage = function (e) {
      let received = JSON.parse(e.data);
      if (received.type) {
        switch (received.type) {
          case _self.response_types.CHAT_RESPONSE:
            _self._sendMessage(received.data);
            break;
          case _self.response_types.FORCE_NEW_SESSION:
            _self._sendMessages(received.data);
            _self.send_websocket_command(
              _self.commands.START_NEW_SESSION,
              null
            );

            break;
          case _self.response_types.LAST_SESSION_MESSAGES:
            if (received.data && received.data.length > 0) {
              _self.setChatboxMessages(received.data);
              if (received.confirm_state) {
                _self.setState({
                  isConfirmState: true,
                  confirmType: received.confirm_type,
                });
              }
            } else {
              _self.send_websocket_command(
                _self.commands.START_NEW_SESSION,
                null
              );
            }
            break;
          case _self.response_types.END_SESSION_STATUS:
            if (received.data && received.data.end_status) {
              _self._sendMessages(received.data.messages);
              if (received.data.start_new) {
                _self.current_command = null;
                setTimeout(function () {
                  _self.setState({
                    messageList: [],
                  });
                  _self.send_websocket_command(
                    _self.commands.START_NEW_SESSION,
                    null
                  );
                }, 3000);
              }
            } else {
              _self._sendMessages(received.data.messages);
            }
            break;
          case _self.response_types.ERROR:
            if (received.data && received.data.length > 0) {
              _self._sendMessages(received.data);
            }
            _self.setState({
              isBotAvailable: false,
            });
            break;
          default:
            console.log(
              'What is meaning of default block missing warning when it doesnt do anything'
            );
        }
        if (received.confirm_state) {
          _self.setState({
            isConfirmState: true,
            confirmType: received.confirm_type
          });
        } else {
          _self.setState({
            isConfirmState: false,
            confirmType: null
          });
        }
      }
    };
    chatSocket.onclose = function (e) {
      if (e.wasClean) {
        console.log(
          `[chat_close] Connection closed cleanly, code=${e.code} reason=${e.reason}`
        );
      } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        console.log('[chat_close] Connection died unexpectedly');
        !_self.props.statusOfChatSocket &&
          _self.props.updateStatusOfChatSocket(true);
      }
    };
    chatSocket.onerror = function (error) {
      console.log(`[chat_error] ${error.message}`);
      !_self.props.statusOfChatSocket &&
        _self.props.updateStatusOfChatSocket(true);
    };
    return chatSocket;
  };

  send_websocket_command = (type, data) => {
    if (this.connected()) {
      this.chatSocket.send(
        JSON.stringify({
          command: type,
          data: data,
        })
      );
    }
  };

  connected = () => {
    return this.chatSocket && this.chatSocket.readyState === WebSocket.OPEN;
  };

  setChatboxMessages = (data) => {
    if (data) {
      let messages = [];
      for (var i = 0, l = data.length; i < l; i++) {
        messages.push({
          type: 'text',
          author: data[i].sent === 1 ? 'me' : 'them',
          data: {
            text: data[i].text,
          },
        });
      }
      this.setState({
        messageList: [...this.state.messageList, ...messages],
      });
    }
  };

  confirmMessage = () => {
    let chatInput = document.getElementsByClassName('sc-user-input--text');
    chatInput[0].onkeydown = (event) => {
      if (
        event.code === 'Enter' &&
        chatInput[0].innerHTML === '' &&
        this.state.isConfirmState
      ) {
        // TO DO confirm message
        if (this.state.confirmType === 'confirm_true_false') {
          this.send_websocket_command(this.commands.CHAT, 'đúng');
        } else {
          this.send_websocket_command(this.commands.CHAT, 'có');
        }
      }
    };
  };

  componentDidMount() {
    let _self = this;
    this._isMounted = true;
    this.chatSocket = this.create_websocket_connection();
    if (!this.chatSocket) {
      // TODO: Disable chat input
    } else {
      let wait_connecting = setInterval(function () {
        if (_self.chatSocket.readyState !== WebSocket.CONNECTING) {
          clearInterval(wait_connecting);
          if (_self.connected()) {
            _self.send_websocket_command(
              _self.commands.REQUEST_LAST_SESSION_DATA,
              null
            );
          } else {
            _self.setState({
              loading: true,
            });
          }
        }
      }, 1000);
    }
  }

  componentWillUnmount() {
    this.chatSocket && this.chatSocket.close(1000);
    this.props.updateStatusOfChatSocket(false);
  }

  render() {
    return (
      <Fragment>
        <Launcher
          agentProfile={agentProfile}
          onMessageWasSent={this._onMessageWasSent.bind(this)}
          messageList={this.state.messageList}
          newMessagesCount={this.state.newMessagesCount}
          showEmoji={false}
          handleClick={this._handleClick.bind(this)}
          isOpen={this.state.isOpen}
        />
        {this.state.loading &&
          ReactDOM.createPortal(
            <LoadingSpinner
              loading={this.state.isOpen}
              text="Loading"
              type="MODAL"
            />,
            document.getElementsByClassName('sc-chat-window')[0]
          )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  statusOfChatSocket: getStatusOfChatSocket(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateStatusOfChatSocket: (status) =>
    dispatch(updateStatusOfChatSocket(status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatWidget);
