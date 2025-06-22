import React, {useState} from 'react';
import './App.css';
import CountryList from './classes/countryList'
import {StatsDisplay} from "./classes/statistics";
//
function App() {
    const localPage:string|null=localStorage.getItem('page');
    if(!localPage){
        localStorage.setItem('page','list');
    }
    const [page,setPage]=useState(localPage);
    if(page === 'list') {
        return (
            <div className="App">
                <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0">
                    <div className="flex items-center gap-4">
                        <button onClick={()=>{setPage('dash');localStorage.setItem('page','dash');}} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">dashboard</button>
                    </div>
                    <h1 className="text-lg font-semibold text-center flex-1">Country App</h1>
                </header>
                <CountryList/>
            </div>
        );
    }else{
        return (
            <div className="App">
                <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0">
                    <div className="flex items-center gap-4">
                    <button onClick={()=>{setPage('list');localStorage.setItem('page','list');}} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">list</button>
                    </div>
                    <h1 className="text-lg font-semibold text-center flex-1">Country App</h1>
                </header>
                <StatsDisplay/>
            </div>
        )
    }
}

export default App;
