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
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {performances: [], attributes: [], pageSize: 10, links: {}};
        this.updatePageSize = this.updatePageSize.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
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
    }

    render() {
        return (
            <div>
                <Header/>
                <PerformanceList performances={this.state.performances}
                                 links={this.state.links}
                                 pageSize={this.state.pageSize}
                                 attributes={this.state.attributes}
                                 onUpdate={this.state.onUpdate}
                                 onNavigate={this.onNavigate}
                                 onDelete={this.onDelete}
                                 updatePageSize={this.updatePageSize}/>
            </div>
        )
    }
}

class Header extends React.Component{
    render() {
        return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="headline" color="inherit">
                        Seats Booking
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }
}

class UpdateDialog extends React.Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var updatedPerformance = {};
        this.props.attributes.forEach(attribute => {
            updatedPerformance[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
        });

        this.props.onUpdate(this.props.performance, updatedPerformance);
        window.location = "#";
    }

    render() {
        return (
            <div>
                <Button variant="raised" color="primary" onClick={this.handleSubmit}>Book it</Button>
            </div>
        )
    }
};

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
                         attributes={this.props.attributes}
                         onUpdate={this.props.onUpdate}
                         onDelete={this.props.onDelete}/>
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
            <tr>
                <td>{this.props.performance.date}</td>
                <td>{this.props.performance.name}</td>
                <td>{this.props.performance.venue}</td>
                <td>{this.props.performance.type}</td>
                <td>
                    <UpdateDialog performance={this.props.performance}
                                      attributes={this.props.attributes}
                                      onUpdate={this.props.onUpdate}/>
                </td>
            </tr>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('react')
)