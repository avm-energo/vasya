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
    const url = `http://${await getHost()}/api/table/out/${localStorage.getItem('userId')}`;
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
    const response = await fetch(`http://${await getHost()}/api/table/active/${localStorage.getItem('userId')}`,
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

export async function GetReportGenerator(mas, pathName, callback) {
    let newMas = {}
    mas.forEach(element => {
        newMas[element.name] = element.value
    });
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${localStorage.getItem('token')}`);
    const response = await fetch(`http://${await getHost()}/api/report/pdf/${pathName}`,
    {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(newMas)
    })
    if (response.status === 200) {
        console.log(response)
        let blob = await response.blob();
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = "ReportGenerator.pdf";
        document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();    
        a.remove();
        callback(true)
    } else {
        callback(false)
        store.dispatch('AddError_action', `${response.status} ${response.statusText}`)
    }
} 

export async function PostAcknowledge(id, callback) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `${localStorage.getItem('token')}`);
    const response = await fetch(`http://${await getHost()}/api/nodes/footer/widget/6MXB7RKGFTT5RNKE/query/acknowledge`,
    {
        headers: myHeaders,
        method: "POST",
        body: `[${id}]`,
    })
    if (response.status === 200) {
        let json = await response.json()
        // console.log(json)
        callback(true, json.status)
    } else {
        callback(false)
    }
}

export async function GetLogOutTime(callback) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const response = await fetch(`http://${await getHost()}/api/table/time`,
    {
        headers: myHeaders,
        method: "GET",
    })
    if (response.status === 200) {
        let json = await response.json()
        callback(true, json.userLogOutClient)
    } else {
        callback(false)
    }
}

export async function GetImage(ninjaResourceId, callback) {
    try {
        const url = `http://${await getHost()}/api/resources/${ninjaResourceId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 
                Authorization: `${localStorage.getItem('token')}`,
                'Accept': 'image/*' // Указываем, что ожидаем изображение
            }
        });

        // console.log(response);

        if (response.status === 200) {
            // Получаем данные как Blob
            const imageBlob = await response.blob();
            
            // Создаем URL для изображения
            const imageUrl = URL.createObjectURL(imageBlob);
            
            // Вызываем callback с URL изображения и blob
            callback(null, {
                url: imageUrl,
                blob: imageBlob
            });
        } else {
            const errorData = await response.json().catch(() => ({}));
            callback(new Error(`Ошибка загрузки изображения: ${response.status} ${response.statusText}`), null);
        }
    } catch (error) {
        console.error('Ошибка при загрузке изображения:', error);
        callback(error, null);
    }
}