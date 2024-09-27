import './App.css';
import { useState } from 'react';
import Auth from './components/Auth';
import DataList from './components/DataList';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    return (
        <div className="App">
            {!isAuthenticated ? (
                <Auth onLogin={handleLogin} />
            ) : (
                <DataList />
            )}
        </div>
    );
}

export default App;
