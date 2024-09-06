import { getXvalue, getYvalue } from "./function.js";

/**
 *              
 * @param {object} config 
 * @returns {(object|object[])}
*/

export function result(config) {
    let traces;
    if(Array.isArray(config.equations)) {
        traces = new Array();
        const xValues = getXvalue(config.start,config.end,config.step);
        let yValues = [];

        for(let i=0;i < config.equations.length;i++) {
            yValues.push(getYvalue(xValues,config.equations[i]));
        }

        for(let i=0;i < config.equations.length;i++) {
            traces.push({
                x: xValues,
                y: yValues[i],
                type: 'scatter',
                name: config.equations[i]
            })
        }

        return traces;
    }
    else {
        const xValues = getXvalue(config.start,config.end,config.step);
        const yValues = getYvalue(xValues,config.equations);
        traces = {
            x: xValues,
            y: yValues,
            type: 'scatter'
        };

        return traces;
    }
}