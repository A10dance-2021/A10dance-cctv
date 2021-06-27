import takeAttendanceURL from "api/requests";

export default async function takeAttendance(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch(takeAttendanceURL, {
        method: 'POST',
        body: formData
    })
    const responseJSON = await response.json();
    const formattedResponse = formatResponse(responseJSON);
    return formattedResponse;
}

function formatResponse(responseJSON) {
    const output = {
        bounding_boxes: [],
        labels: [],
    }

    if (responseJSON.success) {
        const student_id = responseJSON.student_id;
        const student_name = responseJSON.student_name;
        const bounding_boxes = responseJSON.bounding_boxes;
        for (let index = 0; index < bounding_boxes.length; index++) {
            output.bounding_boxes.push(bounding_boxes[index]);
            output.labels.push(`${student_id[index]} ${student_name[index]}`)
        }
    } else {
        console.log(responseJSON.error);
    }

    return output;
}