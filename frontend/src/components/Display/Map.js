import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import _ from 'lodash';

import 'echarts/map/js/world.js';

export default class Map extends Component {
    myChart;
    getOption = () => {
        const geoCoordMap = _.chain(this.props.coordinates)
            .filter(coords => isFinite(coords.from_lat) && isFinite(coords.from_long) && isFinite(coords.to_lat) && isFinite(coords.to_long))
            .map((coords, index) => (
                [
                    [`from_${index}`, [coords.from_long, coords.from_lat]],
                    [`to_${index}`, [coords.to_long, coords.to_lat]],
                ]
            ))
            .reduce((acc, item) => ([...acc, ...item]), [])
            .fromPairs()
            .value();
        const BJData = _.chain(this.props.coordinates)
            .filter(coords => isFinite(coords.from_lat) && isFinite(coords.from_long) && isFinite(coords.to_lat) && isFinite(coords.to_long))
            .map((coords, index) => (
                [
                    { name: `from_${index}` },
                    { name: `to_${index}` },
                ]
            ))
            .reduce((acc, item) => ([...acc, item]), [])
            .value();

        const convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var dataItem = data[i];
                var fromCoord = geoCoordMap[dataItem[0].name];
                var toCoord = geoCoordMap[dataItem[1].name];
                if (fromCoord && toCoord) {
                    res.push({
                        fromName: dataItem[0].name,
                        toName: dataItem[1].name,
                        coords: [fromCoord, toCoord]
                    });
                }
            }
            return res;
        };

        const color = ['#a6c84c', '#ffa022', '#46bee9'];
        const series = [];
        [['Data', BJData]].forEach(function (item, i) {
            series.push({
                name: item[0] + 'Rides',
                type: 'lines',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 3
                },
                lineStyle: {
                    normal: {
                        color: color[i],
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: convertData(item[1])
            },
                {
                    name: item[0] + 'Rides',
                    type: 'lines',
                    zlevel: 2,
                    symbol: ['none', 'arrow'],
                    symbolSize: 10,
                    effect: {
                        show: true,
                        period: 6,
                        trailLength: 0,
                        symbol: 'circle',
                        symbolSize: 15
                    },
                    lineStyle: {
                        normal: {
                            color: color[i],
                            width: 1,
                            opacity: 0.6,
                            curveness: 0.2
                        }
                    },
                    data: convertData(item[1])
                },
                {
                    name: item[0] + 'Rides',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    zlevel: 2,
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{b}'
                        }
                    },
                    symbolSize: function (val) {
                        return val[2] / 8;
                    },
                    itemStyle: {
                        normal: {
                            color: color[i]
                        }
                    },
                    data: item[1].map(function (dataItem) {
                        return {
                            name: dataItem[1].name,
                            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                        };
                    })
                });
        });

        const option = {
            backgroundColor: '#404a59',
            tooltip: {
                trigger: 'item'
            },
            geo: {
                map: 'world',
                zoom: 3,
                scaleLimit: { min: 1, max: 5 },
                label: {
                    emphasis: {
                        show: false
                    }
                },
                dataZoomSelectActive: true,
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#404a59'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            series: series
        };
        return option;
    };
    render() {
        return (
            <div className="col-md-4">
                <ReactEcharts
                    ref={(e) => {
                        if (!e) {
                            return;
                        }
                        this.myChart = e.getEchartsInstance();
                        // console.log(this.myChart.dispatchAction)
                        this.myChart.dispatchAction({
                            type: 'dataZoom',
                            start: 20,
                            end: 30
                        });
                    }}
                    option={this.getOption()}
                    style={{ height: '450px', width: '100%' }}
                    className='react_for_echarts'
                />
            </div>
        );
    }
}