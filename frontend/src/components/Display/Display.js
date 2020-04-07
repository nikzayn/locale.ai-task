import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

import Map from './Map';
import Visualization from '../Visualization/Visualization';


class Display extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sectors: [],
            sector: '',
            getCordinates: '',
            rideDetails: ''
        }
    }

    getSectors() {
        axios.get('http://localhost:8080/sectors')
            .then(response => {
                const result = response.data;
                const data = {
                    getCordinates: result,
                    sectors: _.map(result, (data, sectorName) => Object.assign({}, data, { name: sectorName, value: sectorName }))
                }
                this.setState(data)
            })
            .catch(err => console.log(err))
    }

    getCoordinates(selectedSector) {
        axios.post('http://localhost:8080/rides', selectedSector)
            .then(response => {
                const result = response.data;
                const data = {
                    getCordinates: result,
                    rideDetails: _.map(result, (data) =>
                        Object.assign({},
                            {
                                online_booking: data.online_booking,
                                mobile_site_booking: data.mobile_site_booking,
                                booking_created: data.booking_created,
                                car_cancellation: data.car_cancellation
                            })
                    )
                }
                this.setState(data)
            })
            .catch(err => console.log(err))
    }



    handleChange = (event) => {
        const sector = event.target.value;
        this.setState({
            sector,
        });
        const { sectors } = this.state;
        let selectedSector = _.find(sectors, { value: sector });
        if (!selectedSector) {
            return;
        }
        this.getCoordinates(selectedSector);

    }


    componentDidMount() {
        this.getSectors();
    }

    render() {
        const { sectors } = this.state;
        return (
            <div className="container">
                <h1>Display</h1>
                <h2>Get Sector Coordinates:</h2>
                <div>
                    <select value={this.state.sector} onChange={this.handleChange}>
                        <option value="" disabled>Select one--</option>
                        {_.map(sectors, data => (
                            <option key={data.name} value={data.value}>
                                {data.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <br />
                    <br />
                    <br />
                    <div>
                        {this.state.sector && <Map coordinates={this.state.getCordinates} />}
                        {this.state.sector && <Visualization details={this.state.rideDetails} />}
                    </div>
                </div>
            </div >
        );
    }
}

export default Display;