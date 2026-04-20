import './App.css'
import  IndexScreen from './components/index.jsx';
import Login from './components/login.jsx';
import Dashboard  from './components/dashboard.jsx';

import { useState } from 'react';

function App() {
  const [IsLoggedIn,setIsLoggedIn]=useState(false);
  const [user, setUser] = useState(null);
   
  return (
<>    {IsLoggedIn? <Dashboard user={user} />:<Login setIsLoggedIn={setIsLoggedIn}
     IsLoggedIn={IsLoggedIn}   setUser={setUser}
/>}
   
   
    </>
  )
  
}

export default App;