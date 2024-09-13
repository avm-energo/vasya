import store from "../store";
import throttle from 'lodash/throttle';

export const fetchLinkerTable = async () => {
    let config = await fetch('defaults.json');
    const data = await config.json();

    let response;
    try {
        response = await fetch(
            `http://${data.ip}/api/linker/atoms/start`,{
                method: "GET",
                mode: "cors",
                headers: { Authorization: `${localStorage.getItem('token')}` },
            }
        );
        await store.dispatch('fetchLinkerTable_action', JSON.parse(await response.text()));
    } catch (e) {
        console.log("Ошибка fetchLinkerTable: ", e);
        await store.dispatch('fetchLinkerTable_action', undefined);
    }
};

export const fetchLinkerAtoms = async () => {
    let config = await fetch('defaults.json');
    const data = await config.json();

    let response;
    try {
        response = await fetch(
            `http://${data.ip}/api/linker/atoms/info`,{
                method: "GET",
                mode: "cors",
                headers: { Authorization: `${localStorage.getItem('token')}` },
            }
        );
        const newAtoms = JSON.parse(await response.text());

        // throttledUpdateAtoms(newAtoms);
        await  store.dispatch('fetchLinkerAtoms_action', newAtoms);
    } catch (e) {
        console.log("Ошибка fetchLinkerAtoms: ", e)
        await store.dispatch('fetchLinkerAtoms_action', undefined);
    }
};

const throttledUpdateAtoms = throttle(async (newAtoms) => {
    await store.dispatch('fetchLinkerAtoms_action', newAtoms);
}, 1000);

export const fetchLinkerTree = async () => {
    let config = await fetch('defaults.json');
    const data = await config.json();
    let response = await fetch(
        `http://${data.ip}/api/linker/tree`,{
            method: "GET",
            mode: "cors",
            headers: { Authorization: `${localStorage.getItem('token')}` },
        }
    );
    await store.dispatch('fetchLinkerTree_action', JSON.parse(await response.text()));
};