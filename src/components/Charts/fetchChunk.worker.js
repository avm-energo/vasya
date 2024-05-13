// onmessage = async (event) => {
//     const { intervalIndex } = event.data;
//
//     // Выполняем запрос к серверу для получения данных для интервала
//     const result = await fetchDataForInterval(intervalIndex);
//
//     // Отправляем результат обратно в главный поток
//     postMessage(result);
// };

import moment from "moment/moment";
import axios from "axios";

onmessage = async (event) => {
    const { index, startOfInterval , endOfInterval, query } = event.data;

    // Выполняем запрос к серверу для получения данных для интервала
    // const result = startOfInterval.getTime() + endOfInterval.getTime()

    console.log('запросил из Воркера ', index)
    const headers = {
        'Content-Type': 'application/json',
    };
    const result = await axios.post(query, updatedBody(startOfInterval, endOfInterval),
        {
            headers,
        },)
        .then(response => {
            // console.log(this.controller)
            console.log('получил в Воркере ', index)
            return response.data
        })
        .catch(function (error) {
        });


    // Отправляем результат обратно в главный поток
    postMessage(result);
};


const updatedBody = (startOfInterval, endOfInterval) => {
    var body = `{
          "lowerTime": "${moment(new Date(startOfInterval).getTime()).format("YYYY-MM-DDTHH:mm:ss")}",
          "upperTime": "${moment(new Date(endOfInterval).getTime()).format("YYYY-MM-DDTHH:mm:ss")}"
      }`;
    // console.log((moment(new Date(this.endtime)) - moment(new Date(this.starttime)))/60000*60)
    console.log('new body created in Worker');
    return body
}
