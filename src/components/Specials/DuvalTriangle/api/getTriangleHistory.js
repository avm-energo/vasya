import axios from "axios";
import store from "@/store/index.js";
import {encript} from "@/mixins/encript.js";

export const getTriangleHistory = async (windowPath, name, historyLength) => {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `${localStorage.getItem("token")}`,
    };

    const ip = store.getters.ip;
    const url = `http://${ip}/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(name))}/query/triangle-history/${historyLength}`

    try {
        const result = await axios.get(url, {headers});

        if (result.data !== "" && result.data.resultData.length !== 0) {
            return result.data.resultData;
        } else {
            await store.dispatch("AddNotification_action", {
                text: `Ошибка: Остутствуют данные для формирования истории Треугольника Дюваль`,
                type: "Error",
                time: 2000,
            });
            return null;
        }
    } catch (err) {
        await store.dispatch("AddNotification_action", {
            text: `Ошибка при запросе истории Треугольника Дюваль: ${err.message}`,
            type: "Error",
            time: 2000,
        });
        return null;
    }
}