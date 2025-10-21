import store from '../store/index';
import { encript } from '@/mixins/encript';
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
                'Accept': 'image/*'
            }
        });
        if (response.status === 200) {
            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
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

export async function PostApplyForm(windowPath, widgetName, body, callback) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `${localStorage.getItem('token')}`);
        const response = await fetch(`http://${store.getters.GetDefaultIp}/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(widgetName))}/query/apply-form`,
            {
                headers: myHeaders,
                method: "POST",
                body: JSON.stringify(body),
            })
        console.log(response)
        if (response.status == 200 || response.status == 204) {
            callback(true)
        } else if (response.status == 400) {
            callback(false)
        }
    } catch (e) {

    }
}

export async function PostApplyCommand(windowPath, widgetName, body, callback) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `${localStorage.getItem('token')}`);
        console.log(`http://${store.getters.GetDefaultIp}/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(widgetName))}/query/apply-command`)
        const response = await fetch(`http://${store.getters.GetDefaultIp}/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(widgetName))}/query/apply-command`,
        {
            headers: myHeaders,
            method: "POST",
            body: JSON.stringify(body),
        })
        let json = await response.json()
        let text
        if (json != null) {
            if (response.status == 200) {
                text = json.resultData.description
            } else if (response.status == 204) {
                text = null
            } else if (response.status == 400) {
                text = json.errorDetails
            } else {
                text = 'Истекло время ожидания команды'
            }
        } else {
            text = null
            console.lot('dssds')
        }
        callback (text)
    } catch (e) {
            
    }
}

export async function PostWriteArg(windowPath, widgetName, body, callback) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `${localStorage.getItem('token')}`);
        const response = await fetch(`http://${store.getters.GetDefaultIp}/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(widgetName))}/query/write-arg`,
            {
                headers: myHeaders,
                method: "POST",
                body: JSON.stringify(body),
            })
        console.log(response)
        if (response.status == 200 || response.status == 204) {
            callback(true)
        } else if (response.status == 400) {
            callback(false)
        }
    } catch (e) {

    }
}

export async function GetBaseComponentsCurrent(componentName, callback) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `${localStorage.getItem('token')}`);
        const response = await fetch(`http://${store.getters.GetDefaultIp}/api/nodes/${componentName}/current`,
            {
                headers: myHeaders,
                method: "GET",
            })
        let json = await response.json()
        if (response.status == 200 || response.status == 204) {
            callback(true, json)
        } else if (response.status == 400 || response.status == 404) {
            callback(false)
        }
    } catch (e) {

    }
}


export async function GetFooterDelta(tick, callback) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `${localStorage.getItem('token')}`);
        const response = await fetch(`http://${store.getters.GetDefaultIp}/api/nodes/footer/delta/0/${tick ? tick : -1}`,
            {
                headers: myHeaders,
                method: "GET",
            })
        let json = await response.json()
        if (response.status == 200 || response.status == 204) {
            callback(true, json)
        } else if (response.status == 400 || response.status == 404) {
            callback(false, '')
        }
    } catch (e) {

    }
}

export async function PostTooltiperAck(windowPath, widgetName, widgetType, callback) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `${localStorage.getItem('token')}`);
        const response = await fetch(`http://${store.getters.GetDefaultIp}/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(widgetName))}/query/${widgetType + '-acknowledge'}`,
            {
                headers: myHeaders,
                method: "GET",
            })
        let json = await response.json()
        if (response.status == 200 || response.status == 204) {
            callback(true)
        } else if (response.status == 400 || response.status == 404) {
            callback(false)
        }
    } catch (e) {

    }
}