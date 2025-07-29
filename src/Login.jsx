import { useState } from 'react';
import { REGISTRAR_URL } from './Constants';

const Login = ({ login }) => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');

  const onChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  }

  const click = async () => {
    try {
      const response = await fetch(`${REGISTRAR_URL}/login`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(user.username + ':' + user.password),
          }
        });
      if (response.ok) {
        const data = await response.json();
        login(data.role, data.jwt);
        setMessage('');
      } else {
        setMessage("response error: " + response.status);
      }
    } catch (err) {
      setMessage("network error: " + err);
    }
  }

  return (
    <div className="App bg-[url(/src/assets/classroom_dusk.jpg)] w-screen h-screen bg-cover bg-center flex items-center justify-center text-white">
      <div className="bg-[#29202B]/80 p-8 rounded-xl shadow-lg flex flex-col items-center space-y-6 w-100">
        <h1 className="text-4xl font-bold mb-2">Login</h1>
        <h4 className="text-2xl text-[#d58f8e]">{message}</h4>
        <input id="email" type="text" name="username" placeholder="email id" value={user.username} onChange={onChange}
          className="w-full p-3 rounded-md bg-[#29202B]/90 focus:outline-none focus:ring-2 focus:ring-[#B48389] text-white placeholder-[#B48389]"/>
        <input id="password" type="password" name="password" placeholder="password" value={user.password} onChange={onChange}
          className="w-full p-3 rounded-md bg-[#29202B]/90 focus:outline-none focus:ring-2 focus:ring-[#B48389] text-white placeholder-[#B48389]"/>
        <button id="loginButton" onClick={click} className="w-full bg-[#CCA01D] hover:bg-[#CCA01D] text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-md"> Login </button>
      </div>
    </div>
  );
}

export default Login;