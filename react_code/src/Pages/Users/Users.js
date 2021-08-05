
import React, { Component, useEffect, useState } from 'react'
import axios from 'axios'
import ReactPaginate from 'react-paginate';
import config from "../../config";
import Menu from "../../core/Menu";
import { Button } from 'react-bootstrap';
import Modal from 'react-modal';
import $ from 'jquery';
import Switch from "react-switch";
import { CKEditor } from 'ckeditor4-react';

export default class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            offset: 0,
            data: [],
            user_name: "",
            user_id: 0,
            perPage: 5,
            currentPage: 0,
            dataPoliDesc: '',
            dataSociDesc: '',
        };
        this.handlePageClick = this
            .handlePageClick
            .bind(this);
        this.openEditModal = this.openEditModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.deleteAuthuser = this.deleteAuthuser.bind(this);
        this.fileChangedHandler = this.fileChangedHandler.bind(this);
        this.handleActiveChange = this.handleActiveChange.bind(this);
        this.handleAddNew = this.handleAddNew.bind(this);
        this.onEditorChange = this.onEditorChange.bind( this );
    }

    handleAddNew() {
        this.setState({
            openAddNew: true,
        });
    }
    onEditorChange( evt ) {
        this.setState( {
            dataPersDesc: evt.editor.getData()
        } );
        console.log(this.state.dataPersDesc);
    }
    openEditModal(cmsUserAuthenticationID = 0) {
        const alluserData = this.state.allusers;
        const mediaUrl = "http://localhost:3002/authmedia/";
        //console.log(alluserData);return false;
        alluserData.map((item, index) => {
            // console.log(item.CMSUserAuthenticationID + " == "+cmsUserAuthenticationID);
            if (item.CMSUserAuthenticationID == cmsUserAuthenticationID) {
                //console.log(item);
                this.setState({
                    open: true,
                    CMSUserAuthenticationIDEdit: item.CMSUserAuthenticationID,
                    CMSUsernameEdit: item.CMSUsername,
                    CMSUserIsActiveEdit: item.CMSUserIsActive,
                    CMSUserFirstnameEdit: item.CMSUserFirstname,
                    CMSUserMiddlenameEdit: item.CMSUserMiddlename,
                    CMSUserLastnameEdit: item.CMSUserLastname,
                    CMSUserLocalAddressEdit: item.CMSUserLocalAddress,
                    CMSUserStateEdit: item.CMSUserState,
                    CMSUserCityEdit: item.CMSUserCity,
                    CMSUserZipcodeEdit: item.CMSUserZipcode,
                    visionmissionEdit: item.visionmission,
                    CMSClientPersonalDescriptionEdit: item.CMSClientPersonalDescription,
                    CMSClientPersonalImgPathEdit: (item.CMSClientPersonalImgPath) ? mediaUrl + item.CMSClientPersonalImgPath : null,
                    CMSClientPoliticalDescriptionEdit: item.CMSClientPoliticalDescription,
                    CMSClientPoliticalImgPathEdit: (item.CMSClientPoliticalImgPath) ? mediaUrl + item.CMSClientPoliticalImgPath : null,
                    CMSClientSocialDescriptionEdit: item.CMSClientSocialDescription,
                    CMSClientSocialImgPathEdit: (item.CMSClientSocialImgPath) ? mediaUrl + item.CMSClientSocialImgPath : null,
                })
            }
        });
    }

    handleModalInputChange = (e) => {
        let input = e.target;
        let name = e.target.name;
        let value = input.value;

        this.setState({
            [name]: value
        });
    };

    handleSearchInputChange = (e) => {
        let input = e.target;
        let value = input.value;
        const options = {
            method: 'POST',
            searchText: value

        };
        axios.post(`${config.baseUrl}/authusersbysearch`, options)
            .then()
            .then(
            (result) => {
                const data = result.data;
                this.setState({
                    allusers: data
                });

                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const postData = slice.map(item => <React.Fragment>
                    <tr id={item.CMSUserAuthenticationID}>
                        <td>{item.serialNo}</td>
                        <td>{item.CMSUserDisplayname}</td>
                        <td>{item.CMSUsername}</td>
                        <td id={item.CMSUserAuthenticationID + "_act"}>{(item.CMSUserIsActive) ? "Active" : "Inactive"}</td>
                        <td>
                            <Button variant="info"
                                onClick={(e) => this.openEditModal(item.CMSUserAuthenticationID)}>Edit</Button>
                            &nbsp;<Button variant="danger" onClick={() => this.deleteAuthuser(item.CMSUserAuthenticationID)}>Delete</Button>
                        </td>
                    </tr>

                </React.Fragment>)

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),

                    postData

                },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        this.setState({
                            dataFetched: true,
                            error
                        });
                    }
                )
            });

    };

    closeModal() {
        this.setState({
            open: false,
            openAddNew: false,
        });
    }

    handleFormSubmit = (e) => {
        e.preventDefault();

        let inserItem = [];

        inserItem["user_id"] = 0;
        inserItem["user_name"] = this.state.user_name;


        const myHeaders = new Headers();
        // myHeaders.append('Content-Type', 'application/json');

        const options = {
            method: 'POST',
            body: JSON.stringify({
                user_id: 0,
                user_name: this.state.user_name
            }),
            myHeaders
        };
        let newCatId = 0;
        axios.post(`${config.baseUrl}/authusers`, options)
            .then(res => {
                let resp = res.data;
                let catInfo = resp.userInfo[0];
                newCatId = catInfo.user_id;

            })
            .then(result => {
                this.setState({
                    response: result,
                })
            },
            (error) => {
                this.setState({ error });
            }
            );



        let items = [...this.state.items];

        items.push({
            user_name: this.state.user_name,
            user_id: newCatId
        });

        this.setState({
            items,
            user_name: '',
        });

    };

    deleteAuthuser(authUserId = 0) {

        if (window.confirm("Are you sure want delete the User?")) {
            const options = {
                method: 'POST',
                cmsUserAuthenticationID: authUserId

            };
            axios.post(`${config.baseUrl}/deleteauthuser`, options)
                .then(res => {
                    let result = res.data;
                    this.setState({
                        open: false,
                        response: result,
                    });
                    ///
                    let filteredArray = this.state.allusers.filter(item => item.CMSUserAuthenticationID !== authUserId)
                    this.setState({ allusers: filteredArray });
                    $("#tb #" + authUserId).hide();
                });
        }
    }

    handleInputChange = (e) => {
        let input = e.target;
        let name = e.target.name;
        let value = input.value;

        this.setState({
            [name]: value
        });
    };
    receivedData() {

        fetch(`${config.baseUrl}/authusers`)  // <=== /authusersbypage
            .then(res => res.json())
            .then(
            (result) => {
                const data = result;

                this.setState({
                    allusers: result
                });
                const slice = data.slice(this.state.offset, this.state.offset
                    + this.state.perPage)
                const postData = slice.map(item => <React.Fragment>
                    <tr id={item.CMSUserAuthenticationID}>
                        <td>{item.serialNo}</td>
                        <td>{item.CMSUserFirstname} {item.CMSUserLastname}</td>
                        <td>{item.CMSUsername}</td>
                        <td id={item.CMSUserAuthenticationID + "_act"}>{(item.CMSUserIsActive) ? "Active" : "Inactive"}</td>
                        <td>
                            <Button variant="info"
                                onClick={(e) => this.openEditModal(item.CMSUserAuthenticationID)}>Edit</Button>
                            &nbsp;<Button variant="danger" onClick={() => this.deleteAuthuser(item.CMSUserAuthenticationID)}>Delete</Button>
                        </td>
                    </tr>

                </React.Fragment>)

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    postData
                },
                    // Note: it's important to handle errors here
                    // instead of a catch() block so that we don't swallow
                    // exceptions from actual bugs in components.
                    (error) => {
                        this.setState({
                            dataFetched: true,
                            error
                        });
                    }
                )
            });
    }
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData()
        });

    };

    componentDidMount() {
        this.receivedData()
    }
    fileChangedHandler = (event) => {

        if (event.target.files && event.target.files[0]) {
            if (event.target.name == "CMSClientPersonalImgPathEdit") {
                let img = event.target.files[0];
                this.setState({
                    CMSClientPersonalImgPathNew: img
                });
            }
            if (event.target.name == "CMSClientPoliticalImgPathEdit") {
                let img = event.target.files[0];
                this.setState({
                    CMSClientPoliticalImgPathNew: img
                });
            }
            if (event.target.name == "CMSClientSocialImgPathEdit") {
                let img = event.target.files[0];
                this.setState({
                    CMSClientSocialImgPathNew: img
                });
            }
        }
    }

    updatedDetails = () => {

        const dataUp = new FormData();
        //console.log($("#CMSUserAuthenticationID").val());return false;
        //console.log(this.state);return false;
        const cmsUserAuthenticationID = this.state.CMSUserAuthenticationIDEdit;
        dataUp.append('CMSUserAuthenticationIDEdit', this.state.CMSUserAuthenticationIDEdit);
        dataUp.append('CMSUserUsernameEdit', this.state.CMSUserUsernameEdit);
        dataUp.append('CMSUserPasswordEdit', this.state.CMSUserPasswordEdit);

        dataUp.append('CMSUserFirstnameEdit', this.state.CMSUserFirstnameEdit);
        dataUp.append('CMSUserMiddlenameEdit', this.state.CMSUserMiddlenameEdit);
        dataUp.append('CMSUserLastnameEdit', this.state.CMSUserLastnameEdit);

        dataUp.append('CMSUserLocalAddressEdit', this.state.CMSUserLocalAddressEdit);
        dataUp.append('CMSUserStateEdit', this.state.CMSUserStateEdit);
        dataUp.append('CMSUserCityEdit', this.state.CMSUserCityEdit);
        dataUp.append('CMSUserZipcodeEdit', this.state.CMSUserZipcodeEdit);
        dataUp.append('visionmissionEdit', this.state.visionmissionEdit);
        dataUp.append('CMSUserIsActiveEdit', this.state.CMSUserIsActiveEdit);

        dataUp.append('CMSClientPersonalDescriptionEdit', this.state.CMSClientPersonalDescriptionEdit);
        dataUp.append('CMSClientPersonalImgPathEdit', (this.state.CMSClientPersonalImgPathNew) ? this.state.CMSClientPersonalImgPathNew : this.state.CMSClientPersonalImgPathEdit);

        dataUp.append('CMSClientPoliticalDescriptionEdit', this.state.CMSClientPoliticalDescriptionEdit);
        dataUp.append('CMSClientPoliticalImgPathEdit', (this.state.CMSClientPoliticalImgPathNew) ? this.state.CMSClientPoliticalImgPathNew : this.state.CMSClientPoliticalImgPathEdit);

        dataUp.append('CMSClientSocialDescriptionEdit', this.state.CMSClientSocialDescriptionEdit);
        dataUp.append('CMSClientSocialImgPathEdit', (this.state.CMSClientSocialImgPathNew) ? this.state.CMSClientSocialImgPathNew : this.state.CMSClientSocialImgPathEdit);
        // for(var pair of dataUp.entries()) {
        //     console.log(pair); 
        //  }
        //  return false;
        axios.post(`${config.baseUrl}/addeditauthuser`, dataUp)
            .then(res => {
                let result = res.data;

                this.setState({
                    open: false,
                    openAddNew: false,
                    response: result,
                });

                ///
                const alluserData = this.state.allusers;
                alluserData.map((item, index) => {
                    if (item.CMSUserAuthenticationID == cmsUserAuthenticationID) {
                        item.CMSUserIsActive = result.CMSUserIsActive;
                        item.CMSUserFirstname = result.CMSUserFirstname;
                        item.CMSUserMiddlename = result.CMSUserMiddlename;
                        item.CMSUserLastname = result.CMSUserLastname;
                        item.CMSUserLocalAddress = result.CMSUserLocalAddress;
                        item.CMSUserState = result.CMSUserState;
                        item.CMSUserCity = result.CMSUserCity;
                        item.CMSUserZipcode = result.CMSUserZipcode;
                        item.visionmission = result.visionmission;
                        item.CMSClientPersonalDescription = result.CMSClientPersonalDescription;
                        item.CMSClientPersonalImgPath = result.CMSClientPersonalImgPath;
                        item.CMSClientPoliticalDescription = result.CMSClientPoliticalDescription;
                        item.CMSClientPoliticalImgPath = result.CMSClientPoliticalImgPath;
                        item.CMSClientSocialDescription = result.CMSClientSocialDescription;
                        item.CMSClientSocialImgPath = result.CMSClientSocialImgPath;

                    }
                });
                this.state.allusers = alluserData;
                this.receivedData();
            });;
    };
    handleActiveChange(checked) {
        var ch = (checked == true) ? "Activate" : "Inactivate";
        if (window.confirm("Are you sure want " + ch + " the User?")) {
            const options = {
                method: 'POST',
                checked: checked,
                cmsUserAuthenticationID: this.state.CMSUserAuthenticationIDEdit

            };
            axios.post(`${config.baseUrl}/activechangeauthuser`, options)
                .then(res => {
                    let result = res.data;
                    this.setState({ CMSUserIsActiveEdit: checked });
                    var chA = (checked == true) ? "Active" : "Inactive";
                    var chV = (checked == true) ? 1 : 0;
                    $("#" + this.state.CMSUserAuthenticationIDEdit + "_act").html(chA);
                    const alluserData = this.state.allusers;
                    alluserData.map((item, index) => {
                        if (item.CMSUserAuthenticationID == this.state.CMSUserAuthenticationIDEdit) {
                            item.CMSUserIsActive = chV;
                        }
                    });
                });
        }
        //sconsole.log("checked = " + checked + " ID = " + this.state.CMSUserAuthenticationIDEdit);
    }
    render() {
        return (
            <div>
                <Menu />
                <Modal id="custom-modal" isOpen={this.state.open}
                    ariaHideApp={false}
                    contentLabel="Selected Option" onRequestClose={this.closeModal}>
                    <button className="position-absolute rt-10" onClick={this.closeModal}>Close</button>
                    <form method="post">

                        <table>
                            <tbody>
                                <tr>
                                    <td>Username:</td>
                                    <td><input value={this.state.CMSUsernameEdit}
                                        type="text" readOnly="readOnly" className="border-0" name="CMSUsernameEdit"
                                        onChange={this.handleModalInputChange} /> ({(this.state.CMSUserIsActiveEdit) ? "Active" : "Inactive"}) &nbsp;
                                        <Switch
                                            checked={this.state.CMSUserIsActiveEdit}
                                            onChange={this.handleActiveChange}
                                            onColor="#86d3ff"
                                            onHandleColor="#2693e6"
                                            handleDiameter={20}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                                            height={20}
                                            width={48}
                                            className="react-switch"
                                            id="material-switch"
                                        />

                                    </td>
                                </tr>

                                <tr>
                                    <td>Name:</td>
                                    <td><input value={this.state.CMSUserFirstnameEdit}
                                        type="text" name="CMSUserFirstnameEdit"
                                        onChange={this.handleModalInputChange} />&nbsp;
                            <input value={this.state.CMSUserMiddlenameEdit}
                                            type="text" name="CMSUserMiddlenameEdit"
                                            onChange={this.handleModalInputChange} />&nbsp;
                            <input value={this.state.CMSUserLastnameEdit}
                                            type="text" name="CMSUserLastnameEdit"
                                            onChange={this.handleModalInputChange} /></td>
                                </tr>

                                <tr>
                                    <td>Address:</td>
                                    <td><input value={this.state.CMSUserLocalAddressEdit}
                                        type="text" name="CMSUserLocalAddressEdit"
                                        onChange={this.handleModalInputChange} />&nbsp;
                            <input value={this.state.CMSUserStateEdit}
                                            type="text" name="CMSUserStateEdit"
                                            onChange={this.handleModalInputChange} />&nbsp;
                                <input value={this.state.CMSUserCityEdit}
                                            type="text" name="CMSUserCityEdit"
                                            onChange={this.handleModalInputChange} />&nbsp;
                                <input value={this.state.CMSUserZipcodeEdit}
                                            type="text" name="CMSUserZipcodeEdit"
                                            onChange={this.handleModalInputChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Visson and Mission :</td>
                                    <td><input value={this.state.visionmissionEdit ? this.state.visionmissionEdit : ""}
                                        type="text" name="visionmissionEdit"
                                        onChange={this.handleModalInputChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Personal Description :</td>
                                    <td>
                                    <CKEditor
                    data={(this.state.CMSClientPersonalDescriptionEdit) ? this.state.CMSClientPersonalDescriptionEdit : ""}
                    onChange={this.onEditorChange} />
              
                                    </td>
                                </tr>
                                <tr>
                                    <td>Personal Image :</td>
                                    <td>
                                        <input type="file" onChange={this.fileChangedHandler} name="CMSClientPersonalImgPathEdit" /> &nbsp;
                                <img height='50' width='50' src={this.state.CMSClientPersonalImgPathEdit} />
                                    </td>
                                </tr>

                                <tr>
                                    <td>Political Description :</td>
                                    <td><input value={(this.state.CMSClientPoliticalDescriptionEdit) ?
                                        this.state.CMSClientPoliticalDescriptionEdit : ""}
                                        type="text" name="CMSClientPoliticalDescriptionEdit"
                                        onChange={this.handleModalInputChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Political Image :</td>
                                    <td>
                                        <input type="file" onChange={this.fileChangedHandler} name="CMSClientPoliticalImgPathEdit" /> &nbsp;
                                <img height='50' width='50' src={this.state.CMSClientPoliticalImgPathEdit} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Social Description :</td>
                                    <td><input value={(this.state.CMSClientSocialDescriptionEdit) ?
                                        this.state.CMSClientSocialDescriptionEdit : ""}
                                        type="text" name="CMSClientSocialDescriptionEdit"
                                        onChange={this.handleModalInputChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Social Image :</td>
                                    <td>
                                        <input type="file" onChange={this.fileChangedHandler} name="CMSClientSocialImgPathEdit" /> &nbsp;
                                <img height='50' width='50' src={this.state.CMSClientSocialImgPathEdit} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p>

                            <input type="hidden" value={this.state.CMSUserAuthenticationIDEdit} />
                            <input type="button" onClick={this.updatedDetails} value="Update" />
                        </p>
                    </form>
                </Modal>
                <Modal isOpen={this.state.openAddNew}
                    ariaHideApp={false}
                    contentLabel="Selected Option" onRequestClose={this.closeModal}>
                    <button className="position-absolute rt-10" onClick={this.closeModal}>Close</button>
                    <form method="post">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Username:</td>
                                    <td><input type="text" name="CMSUserUsernameEdit"
                                        onChange={this.handleModalInputChange} /></td>
                                </tr>
                                <tr>
                                    <td>Password:</td>
                                    <td><input type="text" name="CMSUserPasswordEdit"
                                        onChange={this.handleModalInputChange} /></td>
                                </tr>

                                <tr>
                                    <td>Name:</td>
                                    <td><input type="text" name="CMSUserFirstnameEdit"
                                        onChange={this.handleModalInputChange} />&nbsp;
                            <input type="text" name="CMSUserMiddlenameEdit"
                                            onChange={this.handleModalInputChange} />&nbsp;
                            <input type="text" name="CMSUserLastnameEdit"
                                            onChange={this.handleModalInputChange} /></td>
                                </tr>

                                <tr>
                                    <td>Address:</td>
                                    <td><input type="text" name="CMSUserLocalAddressEdit"
                                        onChange={this.handleModalInputChange} placeholder="Address" />&nbsp;
                            <input type="text" placeholder="State" name="CMSUserStateEdit"
                                            onChange={this.handleModalInputChange} />&nbsp;
                                <input type="text" placeholder="City" name="CMSUserCityEdit"
                                            onChange={this.handleModalInputChange} />&nbsp;
                                <input type="text" placeholder="ZipCode" name="CMSUserZipcodeEdit"
                                            onChange={this.handleModalInputChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Visson and Mission :</td>
                                    <td><input type="text" name="visionmissionEdit"
                                        onChange={this.handleModalInputChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Personal Description :</td>
                                    <td><input type="text" name="CMSClientPersonalDescriptionEdit"
                                        onChange={this.handleModalInputChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Personal Image :</td>
                                    <td>
                                        <input type="file" onChange={this.fileChangedHandler} name="CMSClientPersonalImgPathEdit" /> &nbsp;
                                    </td>
                                </tr>

                                <tr>
                                    <td>Political Description :</td>
                                    <td><input type="text" name="CMSClientPoliticalDescriptionEdit"
                                        onChange={this.handleModalInputChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Political Image :</td>
                                    <td>
                                        <input type="file" onChange={this.fileChangedHandler} name="CMSClientPoliticalImgPathEdit" /> &nbsp;
                                </td>
                                </tr>
                                <tr>
                                    <td>Social Description :</td>
                                    <td><input type="text" name="CMSClientSocialDescriptionEdit"
                                        onChange={this.handleModalInputChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Social Image :</td>
                                    <td>
                                        <input type="file" onChange={this.fileChangedHandler} name="CMSClientSocialImgPathEdit" /> &nbsp;
                                        <input type="hidden" value="0" id="CMSUserAuthenticationID" name="CMSUserAuthenticationIDEdit" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <p>

                            <input type="button" onClick={this.updatedDetails} value="Submit" />
                        </p>
                    </form>
                </Modal>
                <input type="text" className="ml-2 mb-2" placeholder='Search user' onChange={this.handleSearchInputChange} />
                <input type="button" onClick={this.handleAddNew} value="Add New" />
                <div id="Table" className='table'>
                    <table id="tb">
                        <tbody>
                            <tr>
                                <th>#</th>
                                <th className="text-center">Name</th>
                                <th className="text-center">User Name</th>
                                <th className="text-center">Is Active</th>
                                <th className="text-center">Action</th>
                            </tr>
                            {this.state.postData}
                        </tbody>
                    </table>
                </div>
                <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"} />
            </div>

        )
    }
}