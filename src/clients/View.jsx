import React from 'react';
import {Table, TableBody, TableHeader, TableFooter, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';

import MenuBar from './../core/MenuBar.jsx';



class ViewClientsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loading: true, clients: []}
        this.renderClients = this.renderClients.bind(this);
        this.fetchClientDataNext = this.fetchClientDataNext.bind(this);
        this.fetchClientDataPrev = this.fetchClientDataPrev.bind(this);
    }

    fetchClientData(page) {
        if(page === undefined) {
            page = 1;
        }
        fetch('/api/clients?page=' + page, {
            headers: new Headers({
                'Authorization': `Bearer ${localStorage.token}`,
                'Content-Type': 'application/json',
            }),
        })
        .then((res) => res.json())
        .then((clients) => {
            this.setState({clients: clients.data, pages: clients.pages, currentPage: page})
        })
    }

    fetchClientDataNext() {
        if(this.state.currentPage + 1 <= this.state.pages) {
            this.fetchClientData(this.state.currentPage + 1);
        }
    }
    fetchClientDataPrev() {
        if(this.state.currentPage - 1 !== 0) {
            this.fetchClientData(this.state.currentPage - 1);
        }
    }


    componentDidMount() {
       this.fetchClientData()
    }

    renderClients() {
       return this.state.clients.map((e) => {
                return (<TableRow>
                        <TableRowColumn>{e.name}</TableRowColumn>
                        <TableRowColumn>{e.phone}</TableRowColumn>
                        <TableRowColumn>{e.country}</TableRowColumn>
                    </TableRow>)
        })
    }
    render() {
        return(
            <div>
                <MenuBar title="Clients"/>
                <Paper zDepth={2} style={{width: '80%', margin: '0 auto'}}>
                    <Table selectable={false}>
                        <TableHeader
                            displaySelectAll={false}
                            enableSelectAll={false}
                            adjustForCheckbox={false} >
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Phone</TableHeaderColumn>
                            <TableHeaderColumn>Address</TableHeaderColumn>
                        </TableRow>
                        </TableHeader>
                        <TableBody
                        displayRowCheckbox={false}
                        showRowHover={true}>
                        {this.renderClients()}
                        </TableBody>
                    </Table>
                    <div style={{textAlign: 'right', height: '20px', padding: '15px'}}>
                        <span style={{marginRight: '20px'}}>Rows: {this.state.clients.length}</span>
                        <span>Page: {this.state.currentPage} out of {this.state.pages}</span>
                        <IconButton onClick={this.fetchClientDataPrev} iconClassName="material-icons" disabled={this.state.currentPage === 1}>keyboard_arrow_left</IconButton>
                        <IconButton onClick={this.fetchClientDataNext} iconClassName="material-icons" disabled={this.state.currentPage === this.state.pages}>keyboard_arrow_right</IconButton>
                    </div>
                </Paper>
            </div>
        )
    }
};

export default ViewClientsTable;