// import axios from 'axios'
import store from '../store/index';
import route from '../router/index';
// import { await getHost() } from './config';
// import moment from 'moment/moment';
// import download from 'downloadjs';

export const getHost = async () => {
    let config = await fetch('defaults.json');
    const data = await config.json(); 
    return data.ip;
};

let ip = null;
async function initializeIp() {
    ip = await getHost();
}

// Вызываем initializeIp(), чтобы получить значение ip один раз
initializeIp();


// function CheckConnectedToCoreOrBooter(stateCore, stateBooter){
//     // console.log(stateBooter + '  ' + stateCore)
//     if (!stateCore) store.dispatch('SetWarning_action', {name: 'core', state: stateCore})
//     if (!stateBooter) store.dispatch('SetWarning_action', {name: 'booter', state: stateBooter})
//     return stateCore || stateBooter
// }
export async function PutLogout(callback) {
    const url = `http://${ip}/api/table/out/${localStorage.getItem('userId')}`;
    const response = await fetch(url,{
        method: 'PUT',
        headers: { Authorization: `${localStorage.getItem('token')}` },
    })
    console.log(response)
    if (response.status === 200) {
        callback()
    } else {
        callback()
    }
}

export async function PutAdminActive(callback) {
    const response = await fetch(`http://${ip}/api/table/active/${localStorage.getItem('userId')}`,
    {
        method: "PUT",
        headers: { Authorization: `${localStorage.getItem('token')}` },
    })
    if (response.status === 200) {
        let json = await response.json()
        // console.log(json)
        callback(true, json.status)
    } else {
        callback(false)
        store.dispatch('AddError_action', `${response.status} ${response.statusText}`)
    }
} 
