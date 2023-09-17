import axios from 'axios';
import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [logorreg, setlogorreg] = useState('login');
  const { setUsername: setLoggedUser, setId } = useContext(UserContext);
  const [message, setMessage] = useState(null); // Add state for displaying messages

  async function handleSubmit(ev) {
    ev.preventDefault();
    const url = logorreg === 'register' ? 'https://chat-box-server-one.vercel.app/register' : 'https://chat-box-server-one.vercel.app/login';

    try {
      const { data } = await axios.post(url, { username, password });
      setLoggedUser(username);
      setId(data.id);
      setMessage({
        type: 'success',
        text: 'Login/Registration successful!', // Customize the success message
      });
    } catch (error) {
      // Handle the error (e.g., display an error message to the user)
      console.error('Registration/Login failed:', error);
      setMessage({
        type: "bg-red-300",
        //text: 'Login/Registration failed. Please try again.', // Customize the error message
        text: "Error : " + error.response.data,
      });
    }
  }

  return (
    <div className="bg-blue-50 h-screen flex items-center justify-center flex-col pb-6">
      <div className="text-blue-700 font-bold flex gap-2 p-8 flex-col">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-12 h-12"
          >
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
          </svg>

          <h1 style={{ fontSize: '36px' }}>Welcome to ChatBox!</h1>
        </div>
        <h5 className="flex items-center justify-center">Sign In to Continue...</h5>
      </div>
      <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          minLength={3}
          required
          onChange={(ev) => setUsername(ev.target.value)}
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <input
          type="password"
          value={password}
          minLength={5}
          required
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2 border"
        />
        <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
          {logorreg === 'register' ? 'Register' : 'Login'}
        </button>
        <div className="text-center mt-2">
          {logorreg === 'register' && (
            <div>
              Already a Member?{' '}
              <button
                className="ml-1"
                onClick={() => setlogorreg('login')}
              >
                <b>Login Here</b>
              </button>
            </div>
          )}
          {logorreg === 'login' && (
            <div>
              Don't have an account?{' '}
              <button
                className="ml-1"
                onClick={() => setlogorreg('register')}
              >
                <b> Register</b>
              </button>
            </div>
          )}
        </div>
        {message && (
          <div className={`flex items-center justify-center mt-4 p-2 text-gray font-medium ${message.type} `} >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
