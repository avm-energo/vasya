import store from "../store"

export const fetchAtoms = async () => {
    let config = await fetch('defaults.json')
    const data = JSON.parse(await config.text())

    let response;
    try {
        response = await fetch(
            `http://${data.ip}/api/linker/atoms/info`,{
                method: "GET",
                mode: "cors",
                headers: { Authorization: `${localStorage.getItem('token')}` },
            }
        );
        await store.dispatch('fetchAtoms_action', JSON.parse(await response.text()));
    } catch (e) {
        console.log("Ошибка ", e)
        await store.dispatch('fetchAtoms_action', undefined);
    }
};

export const fetchTree = async () => {
    let config = await fetch('defaults.json')
    const data = JSON.parse(await config.text())

    let response = await fetch(
        `http://${data.ip}/api/linker/tree`,{
            method: "GET",
            mode: "cors",
            headers: { Authorization: `${localStorage.getItem('token')}` },
        }
    );
    await store.dispatch('fetchTree_action', JSON.parse(await response.text()));
};

