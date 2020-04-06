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

        axios.post('http://localhost:8080/selectedSectors')
            .then(response => {

                this.setState({
                    getCordinates: response.data
                })
            })
            .catch(err => console.log(err))


    }

    componentDidMount() {
        axios.get('http://localhost:8080/parse')
            .then(response => {
                const result = response.data.data;
                this.setState({
                    sectors: _.map(result, (data, sectorName) => Object.assign({}, data, { name: sectorName, value: sectorName }))
                })
            })
            .catch(err => console.log(err))

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
                    {this.state.getCordinates && <Map coordinates={this.state.getCordinates} />}
                    <br />
                </div>
            </div >
        );
    }
}

export default Display;