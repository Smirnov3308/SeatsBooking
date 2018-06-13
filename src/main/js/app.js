'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow');

import { AppBar, Toolbar, Typography, Button, Paper } from '@material-ui/core';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

const root = '/api';

const styles = {
    Paper: {
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        height: 'auto',
        overflowY: 'auto'
    },

    container: {
        display: 'flex',
        padding: 5,
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {performances: [], seats: [], attributes: [], pageSize: 5, links: {}};
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onBookIt = this.onBookIt.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
    }

    loadFromServer(pageSize) {
        follow(client, root, [
            {rel: 'performances', params: {size: pageSize}}]
        ).then(performanceCollection => {
            return client({
                method: 'GET',
                path: performanceCollection.entity._links.profile.href,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                return performanceCollection;
            });
        }).done(performanceCollection => {
            this.setState({
                performances: performanceCollection.entity._embedded.performances,
                attributes: Object.keys(this.schema.properties),
                pageSize: pageSize,
                links: performanceCollection.entity._links});
        });
    }


    onUpdate(performance, updatedPerformance) {
        client({
            method: 'PUT',
            path: performance.entity._links.self.href,
            entity: updatedPerformance,
            headers: {
                'Content-Type': 'application/json',
                'If-Match': performance.headers.Etag
            }
        }).done(response => {
            this.loadFromServer(this.state.pageSize);
        }, response => {
            if (response.status.code === 412) {
                alert('DENIED: Unable to update ' +
                    performance.entity._links.self.href + '. Your copy is stale.');
            }
        });
    }

    onBookIt(selectedSeat) {
        follow(client, root, ['seats']).done(response => {
            client({
                method: 'POST',
                path: response.entity._links.self.href,
                entity: selectedSeat,
                headers: {'Content-Type': 'application/json'}
            })
            client({method: 'GET', path: '/api/seats'}).done(response => {
                this.setState({seats: response.entity._embedded.seats});
            });
        }, response => {
            if (response.status.code === 404) {
                alert('Error, seat already taken');
            }
        });
        client({method: 'DELETE', path: selectedSeat._links.self.href})
    }

    onDelete(performance) {
        client({method: 'DELETE', path: performance._links.self.href}).done(response => {
            this.loadFromServer(this.state.pageSize);
        });
    }
    
    onNavigate(navUri) {
        client({method: 'GET', path: navUri}).done(performanceCollection => {
            this.setState({
                performances: performanceCollection.entity._embedded.performances,
                attributes: this.state.attributes,
                pageSize: this.state.pageSize,
                links: performanceCollection.entity._links
            });
        });
    }

    updatePageSize(pageSize) {
        if (pageSize !== this.state.pageSize) {
            this.loadFromServer(pageSize);
        }
    }

    componentDidMount() {
        this.loadFromServer(this.state.pageSize);

        client({method: 'GET', path: '/api/seats'}).done(response => {
            this.setState({seats: response.entity._embedded.seats});
        });
    }

    render() {
        return (
            <div>
                <Header/>
                <PerformanceList performances={this.state.performances}
                                 seats={this.state.seats}
                                 links={this.state.links}
                                 pageSize={this.state.pageSize}
                                 attributes={this.state.attributes}
                                 onBookIt={this.onBookIt}
                                 onNavigate={this.onNavigate}
                                 updatePageSize={this.updatePageSize}/>
            </div>
        )
    }
}

class Header extends React.Component{
    render() {
        return (
            <AppBar  style={{ width: 'auto' }} position="static">
                <Toolbar>
                    <Typography variant="headline" color="inherit">
                        Seats Booking
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}

class PerformanceList extends React.Component{

    constructor(props) {
        super(props);
        this.handleNavFirst = this.handleNavFirst.bind(this);
        this.handleNavPrev = this.handleNavPrev.bind(this);
        this.handleNavNext = this.handleNavNext.bind(this);
        this.handleNavLast = this.handleNavLast.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        e.preventDefault();
        var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
        if (/^[0-9]+$/.test(pageSize)) {
            this.props.updatePageSize(pageSize);
        } else {
            ReactDOM.findDOMNode(this.refs.pageSize).value =
                pageSize.substring(0, pageSize.length - 1);
        }
    }

    handleNavFirst(e){
        e.preventDefault();
        this.props.onNavigate(this.props.links.first.href);
    }

    handleNavPrev(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.prev.href);
    }

    handleNavNext(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.next.href);
    }

    handleNavLast(e) {
        e.preventDefault();
        this.props.onNavigate(this.props.links.last.href);
    }

    render() {
        var performances = this.props.performances.map(performance =>
            <Performance key={performance._links.self.href}
                         performance={performance}
                         seats={this.props.seats}
                         attributes={this.props.attributes}
                         onBookIt={this.props.onBookIt}/>
        );

        var navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<Button key="first" onClick={this.handleNavFirst}>&lt;&lt;</Button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<Button key="prev" onClick={this.handleNavPrev}>&lt;</Button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<Button key="next" onClick={this.handleNavNext}>&gt;</Button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<Button key="last" onClick={this.handleNavLast}>&gt;&gt;</Button>);
        }

        return (
            <div>
                <Paper style={styles.Paper}>
                    <Typography variant="subheading" color="inherit">
                        Number of views displayed
                    </Typography>
                    <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}/>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Venue</TableCell>
                                <TableCell>Performance type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {performances}
                        </TableBody>
                    </Table>
                    <div>
                        {navLinks}
                    </div>
                </Paper>
            </div>
        )
    }
}

class Performance extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TableRow>
                <TableCell>{this.props.performance.date}</TableCell>
                <TableCell>{this.props.performance.name}</TableCell>
                <TableCell>{this.props.performance.venue}</TableCell>
                <TableCell>{this.props.performance.type}</TableCell>
                <TableCell>
                    <SeatSelect seats = {this.props.seats}
                                performance = {this.props.performance}
                                onBookIt={this.props.onBookIt}/>
                </TableCell>
            </TableRow>
        )
    }
}

class SeatSelect extends React.Component{

    constructor(props) {
        super(props);
        this.state = {selectedType: "", selectedRow: "", selectedPlace: ""};
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleChangeRow = this.handleChangeRow.bind(this);
        this.handleChangePlace = this.handleChangePlace.bind(this);
        this.handleBookIt = this.handleBookIt.bind(this);
    }

    handleChangeType(e) {
        e.preventDefault();
        this.setState({selectedType: this.refs.locationSelect.value});
        ReactDOM.findDOMNode(this.refs.rowSelect).value = '';
        ReactDOM.findDOMNode(this.refs.placeSelect).value = '';
    }

    handleChangeRow(e) {
        e.preventDefault();
        this.setState({selectedRow: this.refs.rowSelect.value});
        ReactDOM.findDOMNode(this.refs.placeSelect).value = '';
    }

    handleChangePlace(e) {
        e.preventDefault();
        this.setState({selectedPlace: (this.refs.placeSelect.value).split('-')[0].trim()});
    }

    handleBookIt(e) {
        e.preventDefault();

        var selectedSeat;
        var currentPerformance = this.props.performance;
        var selectedType = this.state.selectedType;
        var selectedRow = this.state.selectedRow;
        var selectedPlace = this.state.selectedPlace;
        this.props.seats.forEach(function (seat) {

            if (seat.performanceName == currentPerformance.name
                && seat.performanceDate == currentPerformance.date
                && seat.customer == null
                && seat.type == selectedType
                && seat.row == selectedRow
                && seat.place == selectedPlace) {
                selectedSeat = seat;
            }
        });
        if (selectedSeat !== undefined) {
            this.props.onBookIt(selectedSeat);
            this.render();
        }

        ReactDOM.findDOMNode(this.refs.placeSelect).value = '';
    }

    render() {
        var currentPerformance = this.props.performance;

        var seats = this.props.seats.filter(function (seat) {

            if (seat.customer !== null) return false;

            if ((seat.performanceName == currentPerformance.name) && (seat.performanceDate == currentPerformance.date))
                return true;
            else
                return false;
        });

        var types = seats.map(seat => seat.type).filter((v, i, a) => a.indexOf(v) === i);
        var typesOption = types.map(type =>
            <option>{type}</option>
        );

        var selectedType = this.state.selectedType;
        var rows = seats.filter(function (seat) {
            if (seat.type === selectedType) return true;
            else return false;
        }).map(seat => seat.row).filter((v, i, a) => a.indexOf(v) === i);

        var rowsOption = rows.map(row =>
            <option>{row}</option>
        );

        var selectedRow = this.state.selectedRow;
        var places = seats.filter(function (seat) {
            if ((seat.type === selectedType) && (seat.row === selectedRow)) return true;
            else return false;
        });

        var placesOption = places.map(seat =>
            <option>{seat.place + " - " + seat.price + " rub"}</option>
        );

        return (
            <p style={styles.container}>
                <p style={{ margin: 5}}>
                    <Typography variant="subheading" color="inherit">
                        Location
                    </Typography>
                    <select ref="locationSelect" onChange={this.handleChangeType}>
                        <option></option>
                        {typesOption}
                    </select>
                </p>

                <p style={{ margin: 5}}>
                    <Typography variant="subheading" color="inherit">
                        Row
                    </Typography>
                    <select ref="rowSelect" onChange={this.handleChangeRow}>
                        <option></option>
                        {rowsOption}
                    </select>
                </p>

                <p style={{ margin: "5"}}>
                    <Typography variant="subheading" color="inherit">
                        Place
                    </Typography>
                    <select ref="placeSelect" onChange={this.handleChangePlace}>
                        <option></option>
                        {placesOption}
                    </select>
                </p>

                <Button style={{ margin: 5}} variant="raised" color="primary" onClick={this.handleBookIt}>
                    Book it
                </Button>
            </p>
        )
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('react')
)