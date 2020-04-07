import React, { Component } from 'react';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';


class Visualization extends Component {

    getOptions = () => {
        const option = {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['booking created']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: _.map(this.props.details, (data) => {

                }),
                type: 'line',
                areaStyle: {}
            }]
        };
        return option;
    }


    render() {
        console.log(this.props.details);
        return (
            <div className="container">
                <h1>Booking Created</h1>
                <ReactEcharts
                    option={this.getOptions()}
                    style={{ height: '450px', width: '100%', margin: '10px' }}
                    className='react_for_echarts'
                />
            </div>
        )
    }
}

export default Visualization;