import React, { Component } from 'react';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';

class Visualization extends Component {

    getOptionsTravel = () => {
        const values = this.props.travel_type.sort((a, b) => a.vehicle_model_id - b.vehicle_model_id)
        const option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: values.map(data => data.vehicle_model_id)
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: values.map(data => +data.count),
                type: 'bar',
                areaStyle: {}
            }],


            title: {
                text: 'Vehicle Model Id',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },

            tooltip: {
                trigger: 'item'
            },
        };
        return option;
    }

    getOptionsCar = () => {
        const values = this.props.cancellation_data.sort((a, b) => a.from_area_id - b.from_area_id)

        const option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: values.map(data => data.from_area_id)
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: values.map(data => +data.count),
                type: 'line',
                areaStyle: {}
            }],


            title: {
                text: 'Car Cancellation',
                left: 'center',
                top: 20,
                textStyle: {
                    color: '#ccc'
                }
            },

            tooltip: {
                trigger: 'item',
            },
        };
        return option;
    }


    render() {
        return (
            <div className="container">
                <div style={{ display: 'flex' }}>
                    <ReactEcharts
                        option={this.getOptionsTravel()}
                        style={{ height: '450px', width: '50%', margin: '10px' }}
                        className='react_for_echarts'
                    />
                    <ReactEcharts
                        option={this.getOptionsCar()}
                        style={{ height: '450px', width: '50%', margin: '10px' }}
                        className='react_for_echarts'
                    />
                </div>
            </div>
        )
    }
}

export default Visualization;