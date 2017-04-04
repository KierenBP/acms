import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


class ViewClientsTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {loading: true, clients: []}
        this.renderClients = this.renderClients.bind(this);
    }

    componentDidMount() {
        fetch('/api/clients/', {
            headers: new Headers({
                'Authorization': `Bearer ${localStorage.token}`,
                'Content-Type': 'application/json',
            }),
        })
        .then((res) => res.json())
        .then((clients) => {
            this.setState({clients: clients.data})
        })
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
                    
                    <TableRow>
                        <TableRowColumn>1</TableRowColumn>
                        <TableRowColumn>John Smith</TableRowColumn>
                        <TableRowColumn>Employed</TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }
};

export default ViewClientsTable;