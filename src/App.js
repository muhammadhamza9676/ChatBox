import axios from "axios";
import { UserContextProvider } from "./UserContext";
import Routes from "./Routes";

function App() {

  axios.defaults.baseURL = 'https://chat-box-server-one.vercel.app'; //'http://localhost:5000';
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
    <Routes/>
    </UserContextProvider>
  );
}

export default App;
