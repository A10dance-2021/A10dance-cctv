import React, { Component } from "react";

export default class BoxCanvas extends Component {
    isEqualArray(array1, array2) {
        if (array1.length === array2.length) {
            for (let index = 0; index < array1.length; index++) {
                if (array1[index] !== array2[index]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps) {
        const { bounding_boxes, labels } = this.props;
        // if any change in the image, bounding boxes or labels, we redraw the canvas
        if (!this.isEqualArray(prevProps.bounding_boxes, bounding_boxes) || !this.isEqualArray(prevProps.labels, labels)) {
            this.redrawCanvas(bounding_boxes, labels);
        }
    }

    redrawCanvas(bounding_boxes, labels) {
        console.log(bounding_boxes);
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.font = "16px Arial";
        // clear any previous image
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // start drawing bounding boxes here
        ctx.fillStyle = 'red';
        const scaledBoxes = bounding_boxes.map((box) => [box[0], box[1], box[2]-box[0], box[3]-box[1]]);
        const mirroredBoxes = scaledBoxes.map((box) => [ canvas.width - box[0] - box[2], box[1], box[2], box[3] ]);
        for (const box of mirroredBoxes) {
            ctx.strokeRect(box[0], box[1], box[2], box[3]);
            ctx.fillRect(box[0], box[1]+box[3], box[2], 20);
        }

        // write words after drawing the rectangles to prevent words being covered
        ctx.fillStyle = 'white';
        for (const index in scaledBoxes) {
            const box = mirroredBoxes[index];
            ctx.fillText(labels[index], box[0], box[1]+box[3]+10);
        }
    }

    render() {
        return (
            <canvas id='canvas' width={this.props.width} height={this.props.height} style={this.props.style}></canvas>
        )
    }
}