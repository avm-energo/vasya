import axios from "axios";
import moment from "moment/moment";
import store from "@/store";
import {encript} from "@/components/Charts/TrendViewerAmCharts/utils/encript";

export const getTrendsData = async (startDate, endDate, windowPath, name, controller) => {

    const ip = store.getters.ip;
    const article = updatedBody(startDate, endDate)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `${localStorage.getItem('token')}`,
    };
    return await axios.post(`http://${ip}/api/nodes/${encript((new TextEncoder()).encode(windowPath))}/widget/${encript((new TextEncoder()).encode(name))}/query/trend-history`, article,
        {
            headers,
            signal: controller.signal
        },)
        .then(response => {
            // console.log("Вот и ответ 2", response.data)
            return response.data
        })
        .catch(function (error) {
            console.log("Ошибка 2", error)
        });
};

const updatedBody = (start, end) => {
    return `{
          "lowerTime": "${moment(new Date(start).getTime()).format("YYYY-MM-DDTHH:mm:ss")}",
          "upperTime": "${moment(new Date(end).getTime()).format("YYYY-MM-DDTHH:mm:ss")}"
      }`
};





