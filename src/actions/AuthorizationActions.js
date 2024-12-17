import store from '../store/index';
import route from '../router/index';
// import { HOST } from './config'

// Ваша функция, которая забирает значения из файла defaults.json
export const getHost = async () => {
    let config = await fetch('defaults.json');
    const data = await config.json(); // Вам не нужно вызывать config.text() и JSON.parse(a), используйте config.json()
    return data.ip;
};

export const login = async (login, password, callback) => {
    try {
        const url = `http://${await getHost()}/api/table/auth`;

        const data = `{
            "Login" : "${login}",
            "Password" : "${password}"
            }`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        });
        const text = await response.json();
        // console.log(response)
        if (response.status == 200){
            store.dispatch('setIsAuth_action', true)
            // localStorage.setItem('role', text.role)
            localStorage.setItem('token', 'Bearer ' + text.access_token)
            localStorage.setItem('userName', login)
            localStorage.setItem('creatorId', text.client.creatorId)
            localStorage.setItem('userId', text.client.id)
            localStorage.setItem('projectId', text.client.projectId)
            // store.dispatch('setRole_action', text.role)
            store.dispatch('setUserName_action', login)
            store.dispatch('setUserId_action', text.client.id)
            store.dispatch('setProjectId_action', text.client.projectId)
            callback({ successful: true })
        } else {
            // console.log(response)
            callback({ successful: false, message: text.loginError.toString()})
        }
        // if (response.data.warning) {
        //     store.dispatch('AddNotification_action', { text: text.warning, type: 'Warning', time: 10000 })
        // }
    } catch (response) {
        callback({ successful: false, message: 'ConnectionError' })
        // store.dispatch('AddError_action', `${response.request.status} ${response.request.statusText}`)
    }
}

export const auth = async () => {
    try {
        if (!localStorage.getItem('token')) {
            route.push('/authorization');
            return
        }
        const url = `http://${await getHost()}/api/table/check`;
        var formdata = new FormData();
        formdata.append("token", localStorage.getItem('token').split(' ')[1]);
        const response = await fetch(url,{
            method: 'POST',
            headers: { Authorization: `${localStorage.getItem('token')}` },
            body: formdata
        })
        const text = await response.json();
        // console.log(text)
        if (text.status == 200){
            // if (localStorage.getItem('userName') != 'Guest') {
                store.dispatch('setIsAuth_action', true)
                store.dispatch('setUserName_action', localStorage.getItem('userName'))
                store.dispatch('setUserId_action', localStorage.getItem('userId'))
                store.dispatch('setProjectId_action', localStorage.getItem('projectId'))
            // } else {
            //     store.dispatch('setIsAuth_action', true)
            //     store.dispatch('setRole_action', 'Guest')
            //     store.dispatch('setUserName_action', 'Guest')
            //     store.dispatch('setUserPermissionsByName_action', 'Гость')
            // }
        } else {
            if (text.status == 400) {
                throw new SyntaxError('Bad token')
            } else if (text.status == 404){
                throw new SyntaxError('Old token')
            }
        }
        
        // if (response.data.warning) {
        //     store.dispatch('AddNotification_action', { text: response.data.warning, type: 'Warning', time: 10000 })
        // }
    } catch (e) {
        console.log(e)
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        localStorage.removeItem('creatorId')
        localStorage.removeItem('userId')
        store.dispatch('setIsAuth_action', false)
        route.push('/authorization')
        // store.dispatch('AddError_action', `${e.response.request.status} ${e.response.request.statusText}`)
    }
}

export const logout = async (callback) => {
    try {
        const url = `http://${await getHost()}/api/table/out/${localStorage.getItem('userId')}`;
        var formdata = new FormData();
        formdata.append("token", localStorage.getItem('token').split(' ')[1]);
        const response = await fetch(url,{
            method: 'PUT',
            headers: { Authorization: `${localStorage.getItem('token')}` },
            body: formdata
        })
        console.log('dsds')
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        localStorage.removeItem('creatorId')
        localStorage.removeItem('userId')
        store.dispatch('setIsAuth_action', false)
        store.dispatch('setUserName_action', null)
        route.push('/authorization')
        callback({ successful: true })
    } catch (e) {
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        localStorage.removeItem('creatorId')
        localStorage.removeItem('userId')
        store.dispatch('setIsAuth_action', false)
        store.dispatch('setUserName_action', null)
        route.push('/authorization')
        callback({ successful: false })
    }
}