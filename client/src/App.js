import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap'
import {
    addInventoryItemToDatabase,
    deleteDataFromDatabase, editDataFromDatabase, exportDataToCsv,
    fetchItemsFromDatabase,
} from './actions/CreateReadUpdateDeleteActions';
import {getInventoryItemColumns, getStorageLocation} from "./actions/InventoryItemInterface";

class App extends React.Component {

    constructor(props) {
        super(props);
        const tableColumns = getInventoryItemColumns();
        tableColumns.push("actions");
        this.state = {
            inventoryItems: [],
            apiDataLoaded: false,
            modalCreateOpen: false,
            modalEditOpen: false,
            modalDeleteOpen: false,
            tableHeader: tableColumns,
            currentTargetedObject: null,
        };
        this.openCreationModal = this.openCreationModal.bind(this);
        this.closeCreationModal = this.closeCreationModal.bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
        this.renderCreationModal = this.renderCreationModal.bind(this);
        this.renderEditModal = this.renderEditModal.bind(this);
        this.loadInMemory = this.loadInMemory.bind(this);
    }

    loadInMemory = async () => {
        fetchItemsFromDatabase().then((data) => {
            this.setState({
                inventoryItems: data,
                apiDataLoaded: true
            })
        });
    }

    async componentDidMount() {
        await this.loadInMemory();
    }

    openCreationModal = () => {
        this.setState({
            modalCreateOpen: true,
        })
    }

    closeCreationModal = () => {
        this.setState({
            modalCreateOpen: false,
        })
    }

    openEditModal = (data) => {
        this.setState({
            modalEditOpen: true,
            currentTargetedObject: data,
        })
    }

    closeEditModal = () => {
        this.setState({
            modalEditOpen: false,
            currentTargetedObject: null,
        })
    }


    closeDeleteModal = () => {
        this.setState({
            modalDeleteOpen: false,
        })
    }

    openDeleteModal = (data) => {
        this.setState({
            modalDeleteOpen: true,
            currentTargetedObject: data
        })
    }

    // Dynamically changes columns
    renderTableColumns(column) {
        return column.map((data) => {
            return <th scope="col" key={data}>{data}</th>
        });
    }

    renderRowData() {
        const column = this.state.tableHeader;
        return this.state.inventoryItems.map((data) => {
                return (
                    <tr>
                        {
                            column.map((headers) => {
                                if (headers === 'actions') {
                                    return <td key={headers}>
                                        <button className="btn btn-primary" type="submit"
                                                onClick={() => this.openEditModal(data)}>Edit
                                        </button>
                                        <button className="btn btn-danger" type="submit"
                                                onClick={() => this.openDeleteModal(data)}>Delete
                                        </button>
                                    </td>
                                }
                                return <td key={data[headers]}>{data[headers]}</td>
                            })
                        }
                    </tr>
                )
            }
        );
    }

    renderTable() {
        return (
            <table className="table">
                <thead>
                <tr>{this.renderTableColumns(this.state.tableHeader)}</tr>
                </thead>
                <tbody>
                {this.state.inventoryItems.length > 0 ? this.renderRowData() : ''}
                </tbody>
            </table>
        );

    }

    canSubmit = (productName, count) => {
        let canSubmit = true;
        if (productName === '') {
            document.getElementById("invalid-name").classList.remove("invalid-feedback");
            canSubmit = false;
        } else if (count === '') {
            document.getElementById("invalid-count").classList.remove("invalid-feedback");
            canSubmit = false;
        } else if (isNaN(count)) {
            document.getElementById("not-a-number").classList.remove("invalid-feedback");
            canSubmit = false;
        }
        return canSubmit;
    }

    // Validates value in form, calls addInventoryToDatabase, and refresh page to update table
    validateAndAddItem = async () => {
        const productName = document.getElementById("product-name").value;
        const count = document.getElementById("inventory-count").value;
        const location = document.getElementById("selected-location").value;
        if (this.canSubmit(productName, count)) {
            addInventoryItemToDatabase(productName, count, location).then(() => {
                this.setState({
                    modalCreateOpen: false,
                })
            });
            setTimeout(() => window.location.reload(), 900, false);
        }
    }

    // Validates value in form, calls editDataFromDatabase, and refresh page to update table
    validateAndEditItem = async () => {
        const productName = document.getElementById("product-name").value;
        const count = document.getElementById("inventory-count").value;
        const location = document.getElementById("selected-location").value;
        if (this.canSubmit(productName, count)) {
            editDataFromDatabase(this.state.currentTargetedObject, productName, count, location)
                .then(() => {
                    this.setState({
                        modalEditOpen: false,
                    });
                    setTimeout(() => window.location.reload(), 900, false);

                });
        }
    }

    // Validates value in form, calls addInventoryToDatabase, and refresh page to update table
    deleteItem = async () => {
        deleteDataFromDatabase(this.state.currentTargetedObject).then(()=>{});
        this.setState({
            modalDeleteOpen: false,
        });
        setTimeout(() => window.location.reload(), 900, false);
    }

    renderDeleteModal() {
        return (
            <Modal show={this.state.modalDeleteOpen}>
                <Modal.Dialog>
                    <Modal.Header onClick={this.closeDeleteModal} closeButton>
                        <Modal.Title>Delete Item</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <p> Are you sure you want to delete the item? </p>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.closeDeleteModal}>Close</Button>
                            <Button variant="primary" onClick={this.deleteItem}>Delete</Button>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>
        );
    }

    renderEditModal() {
        if (this.state.currentTargetedObject) {
            return (
                <Modal show={this.state.modalEditOpen}>
                    <Modal.Dialog>
                        <Modal.Header onClick={this.closeEditModal} closeButton>
                            <Modal.Title>Edit Item</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="modal-body">
                            <form className="form-group" id="createform">
                                <label> Name: </label>
                                <br/>
                                <input type="text" name="productname" id="product-name"
                                       defaultValue={this.state.currentTargetedObject.name}/>
                                <div className="invalid-feedback" id="invalid-name">Item name cannot be empty</div>
                                <br/>
                                <label> Count: </label>
                                <br/>
                                <input type="text" name="inventory-count" id="inventory-count"
                                       defaultValue={this.state.currentTargetedObject.count}/>
                                <div className="invalid-feedback" id="invalid-count">Count cannot be empty</div>
                                <div className="invalid-feedback" id="not-a-number">Count has to be a number</div>
                                <br/>
                                <label> Location: </label>
                                <select className="form-select" id="selected-location"
                                        defaultValue={this.state.currentTargetedObject.location}>
                                    {this.renderDragdownLocation()}
                                </select>
                                <Button variant="secondary" onClick={this.closeEditModal}>Close</Button>
                                <Button variant="primary" onClick={this.validateAndEditItem}>Save Changes</Button>
                            </form>
                        </Modal.Body>
                    </Modal.Dialog>
                </Modal>
            );
        }
    }

    renderDragdownLocation() {
        return (
            getStorageLocation().map((city) => {
                return <option key={city}> {city} </option>
            })
        )
    }

    renderCreationModal() {
        return (
            <Modal show={this.state.modalCreateOpen}>
                <Modal.Dialog>
                    <Modal.Header onClick={this.closeCreationModal} closeButton>
                        <Modal.Title>Add a new Item!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <form className="form-group" id="createform">
                            <label> Name: </label>
                            <br/>
                            <input type="text" name="productname" id="product-name"/>
                            <div className="invalid-feedback" id="invalid-name">Item name cannot be empty</div>
                            <br/>
                            <label> Count: </label>
                            <br/>
                            <input type="text" name="inventory-count" id="inventory-count"/>
                            <div className="invalid-feedback" id="invalid-count">Count cannot be empty</div>
                            <div className="invalid-feedback" id="not-a-number">Count has to be a number</div>

                            <br/>
                            <label> Location: </label>
                            <select className="form-select" id="selected-location">
                                {this.renderDragdownLocation()}
                            </select>
                            <Button variant="secondary" onClick={this.closeCreationModal}>Close</Button>
                            <Button variant="primary" onClick={this.validateAndAddItem}>Add Item</Button>
                        </form>
                    </Modal.Body>
                </Modal.Dialog>
            </Modal>
        );
    }

    render() {
        return (
            <div>
                <button type="button" className="btn btn-primary" onClick={this.openCreationModal}>
                    Add New Item
                </button>
                <button type="button" className="btn btn-primary float-end" onClick={exportDataToCsv}>
                    Export Data To CSV
                </button>
                {this.state.apiDataLoaded ? this.renderTable() : <div/>}
                {this.renderCreationModal()}
                {this.renderEditModal()}
                {this.renderDeleteModal()}
            </div>
        );
    }
}

export default App;
