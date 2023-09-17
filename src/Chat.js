import React, { useContext, useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import Logo from './Logo';
import { UserContext } from './UserContext';
import { uniqBy } from 'lodash';
import axios from 'axios';
import './Chat.css';

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectUser, setSelectUser] = useState(null);
  const { username, id, setId, setUsername } = useContext(UserContext);
  const [newMsgText, setNewMsgText] = useState('');
  const [messages, setMessages] = useState([]);
  const BoxRef = useRef();

  const [isChatFullScreen, setIsChatFullScreen] = useState(false);

  useEffect(() => {
    connectToWs();
  }, [selectUser]);

  function connectToWs() {
    // const ws = new WebSocket('ws://localhost:4040');
    const ws = new WebSocket('wss://chat-box-server-one.vercel.app:4040');
    setWs(ws);
    ws.addEventListener('message', handleMessage);
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log('Disconnected! Trying to Connect Again......');
        connectToWs();
      }, 1000);
    });
  }

  function logout() {
    axios.post('/logout').then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else if ('text' in messageData) {
      if (messageData.sender === selectUser) {
        setMessages((prev) => [...prev, { ...messageData }]);
      }
    }
  }

  const onlinePeopleExcl = { ...onlinePeople };
  delete onlinePeopleExcl[id];

  const messageWtDup = uniqBy(messages, '_id');

  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    ws.send(JSON.stringify({ recipient: selectUser, text: newMsgText, file }));
    if (file) {
      axios.get('/messages/' + selectUser).then((res) => {
        setMessages(res.data);
      });
    } else {
      setNewMsgText('');
      setMessages((prev) => [
        ...prev,
        { text: newMsgText, sender: id, recipient: selectUser, _id: Date.now() },
      ]);
    }
  }

  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
  }

  useEffect(() => {
    const divv = BoxRef.current;
    if (divv) {
      divv.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (selectUser) {
      axios.get('/messages/' + selectUser).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectUser]);

  useEffect(() => {
    axios.get('/people').then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      setOfflinePeople(offlinePeople);
      //console.log({ offlinePeople });
    });
  }, [onlinePeople]);

  // Function to toggle chat screen between full screen and normal view
  const toggleChatScreen = () => {
    setIsChatFullScreen((prev) => !prev);
  };

  return (
    <div className={`flex h-screen ${isChatFullScreen ? 'fixed inset-0' : ''}`}>
      <div
        className={`bg-white-100 w-1/3 flex flex-col ${isChatFullScreen ? 'hidden' : ''
          }`}
      >
        {/* ... (existing online and offline people list) */}
        <div className='flex-grow'>
          <div onClick={toggleChatScreen}><Logo /></div>
          <div className='relative overflow-hidden' style={{ height: '36rem' }}>
            <div className='overflow-y-scroll absolute inset-0 top-0 right-0 left-0 bottom-2 custom-scrollbar'>
              {Object.keys(onlinePeopleExcl).map(userId => (
                <div key={userId} onClick={() => setSelectUser(userId)} className={"border-b border-grey-100 flex items-center gap-2 cursor-pointer " + (userId === selectUser ? 'bg-blue-100' : '')}>
                  {userId === selectUser && <div className='w-1 bg-blue-500 h-12 rounded-r-md'>  </div>}
                  <div className='flex gap-2 py-2 pl-4 items-center'>
                    <Avatar online={true} username={onlinePeople[userId]} userId={userId} />
                    <span>{onlinePeople[userId]}</span>
                  </div>
                </div>
              ))}

              {Object.keys(offlinePeople).map(userId => (
                <div key={userId} onClick={() => setSelectUser(userId)} className={"border-b border-grey-100 flex items-center gap-2 cursor-pointer " + (userId === selectUser ? 'bg-blue-100' : '')}>
                  {userId === selectUser && <div className='w-1 bg-blue-500 h-12 rounded-r-md'>  </div>}
                  <div className='flex gap-2 py-2 pl-4 items-center'>
                    <Avatar online={false} username={offlinePeople[userId].username} userId={userId} />
                    <span>{offlinePeople[userId].username}</span>
                  </div>
                </div>
              ))}

            </div>
          </div>



        </div>





        <div
          className={`p-2 text-center flex items-center justify-center ${isChatFullScreen ? 'hidden' : ''
            }`}
        >
          {/* ... (existing user info) */}
          <div className='p-2 text-center flex items-center justify-center'>
            <span className='mr-2 text-sm text-gray flex items-center flex-col'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
              {username}
            </span>
            <button className='text-sm text-gray-600 bg-blue-200 px-2 py-1 mb-2 border rounded-sm border-blue-400' onClick={logout}>Logout</button>
          </div>

        </div>
      </div>

      <div
        className={`flex flex-col bg-blue-100 w-2/3 p-2 ${isChatFullScreen ? 'w-full' : ''
          }`}
      >
        {/* ... (existing chat screen content) */}
        <div className={`block ${isChatFullScreen ? '' : 'hidden'}`} onClick={toggleChatScreen} >
          <Logo />
        </div>
        <div className='flex-grow'>

          {!selectUser && (
            <div className='flex h-full items-center justify-center'>
              <div className='text-white text-5xl'>&larr;Click on a person to Chat!</div>
            </div>
          )}
          {!!selectUser && (
            <div className='relative h-full'>
              <div className="overflow-y-scroll absolute top-0 right-0 left-0 bottom-2 custom-scrollbar overflow-x-hidden">
                {messageWtDup.map(message => (
                  <div key={message._id} className={(message.sender === id ? 'text-right px-2' : 'text-left')}>
                    <div className={"text-left inline-block p-2 my-2 rounded-md " + (message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-grey-500')}>
                      {message.text}
                      {message.file && (
                        <div>
                          <a target="_blank" rel="noreferrer" className='flex items-center gap-1 border-b' href={axios.defaults.baseURL + '/uploads/' + message.file}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" /></svg>
                            {message.file}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={BoxRef}></div>
              </div>
            </div>
          )}
        </div>
        {!!selectUser && (
          <form className='flex overflow-x-auto gap-2' onSubmit={sendMessage}>
            <input type='text' value={newMsgText} onChange={ev => setNewMsgText(ev.target.value)} placeholder='Type your Message here ' className='bg-white flex-grow border rounded-sm p-2' />
            <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-sm border border-blue-200">
              <input type="file" className="hidden" onChange={sendFile} />
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z" clipRule="evenodd" /></svg>
            </label>
            <button type='submit' className='bg-blue-500 p-2 text-white rounded-sm' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
            </button>
          </form>
        )}


      </div>
    </div>
  );
};

export default Chat;
