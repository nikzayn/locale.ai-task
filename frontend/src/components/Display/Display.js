import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';

import Map from './Map';


class Display extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sectors: [],
            sector: '',
            getCordinates: '',
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
                    getCordinates: result
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
                <div className="col-md-12">
                    <br />
                    <br />
                    <br />
                    {this.state.sector && <Map coordinates={this.state.getCordinates} />}
                    <br />
                </div>
            </div >
        );
    }
}

export default Display;