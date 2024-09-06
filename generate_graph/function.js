import * as math from "mathjs";
import os from 'os';
import dns from 'dns';

/**
 * @param {number} start 
 * @param {number} end 
 * @param {number} step 
 * @return {number[]}
 */
export function getXvalue(start,end,step) {
    // const result = [];
    // if (start === end) return result.push(start); //start hay end cung dc
    // while (start <= end) {
    //     result.push(start);
    //     start += step;
    // }
    // return result;
    return math.range(start, end, step).toArray();
}

/**
 * 
 * @param {number[]} xValues 
 * @param {string} equation 
 * @returns {number[]}
 */

export function getYvalue(xValues,equation) {
    const expr = math.compile(equation)
    const yValues = xValues.map(function (x) {
        return expr.evaluate({x: x})
    })
    return yValues;
}

export function getGraph(traces) {
    let html;
    if(Array.isArray(traces)) {
        html = `
            <head>
                <!-- Load plotly.js into the DOM -->
                <script src='https://cdn.plot.ly/plotly-2.34.0.min.js'></script>
            </head>
            <body>
                <div id='myDiv'></div>
                <script>
                    var layout = {
                        width: 1300,
                        height: 800,
                        xaxis: {
                            title: 'Trục X'
                        },
                        yaxis: {
                            title: 'Trục Y'
                        }
                    };
                    Plotly.newPlot('myDiv',${JSON.stringify(traces)},layout,{scrollZoom: true,responsive: true});
                </script>
            </body>
        `
    }
    else {
        html = `
            <head>
                <!-- Load plotly.js into the DOM -->
                <script src='https://cdn.plot.ly/plotly-2.34.0.min.js'></script>
            </head>
            <body>
                <div id='myDiv'></div>
                <script>
                    var layout = {
                        width: 1300,
                        height: 800,
                        xaxis: {
                            title: 'Trục X'
                        },
                        yaxis: {
                            title: 'Trục Y'
                        }
                    };
                    Plotly.newPlot('myDiv',[${JSON.stringify(traces)}],layout,{scrollZoom: true,responsive: true});
                </script>
            </body>
        `
    }

    return html;
}

export function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return '0.0.0.0';
}
