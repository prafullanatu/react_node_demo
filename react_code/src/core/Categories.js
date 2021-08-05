import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import Catgrid from '../Table/Catgrid';
import Form from '../Form/Form';


class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            dataFetched: false,
            items: [],
            category_name: "",
            category_id: 0
        };
        this.deleteCategory = this.deleteCategory.bind(this);
    }

    componentDidMount() {
        fetch("http://reactdemoapi/api/allcategories")
            .then(res => res.json())
            .then(
            (result) => {
                this.setState({
                    dataFetched: true,
                    items: result.allcat
                });
                //console.log(result.allcat);
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
    }

    handleFormSubmit = (e) => {
        e.preventDefault();

        let apiUrl;
        let inserItem = [];

        inserItem["category_id"] = 0;
        inserItem["category_name"] = this.state.category_name;
        // console.log(inserItem);
        apiUrl = 'http://reactdemoapi/api/newCategory';

        const myHeaders = new Headers();
        // myHeaders.append('Content-Type', 'application/json');

        const options = {
            method: 'POST',
            body: JSON.stringify({
                category_id: 0,
                category_name: this.state.category_name
            }),
            myHeaders
        };
        let newCatId = 0;
        axios.post(apiUrl, options)
            .then(res => {
                let resp = res.data;
                let catInfo = resp.categoryInfo[0];
                newCatId = catInfo.category_id;

            })
            .then(result => {
                this.setState({
                    response: result,
                })
            },
            (error) => {
                this.setState({ error });
            }
            )



        let items = [...this.state.items];

        items.push({
            category_name: this.state.category_name,
            category_id: newCatId
        });

        this.setState({
            items,
            category_name: '',
        });

    };
    deleteCategory(category_id) {
        const items = this.props.items;
        const apiUrl = 'http://reactdemoapi/api/deletecategory';
        const formData = new FormData();
        formData.append('category_id', category_id);
        const options = {
            method: 'POST',
            body: formData
        }

        fetch(apiUrl, options)
            .then(res => res.json())
            .then(
            (result) => {
                const items = this.state.items.filter(i => i.category_id !== category_id)
                this.setState({ items });
            },
            (error) => {
                this.setState({ error });
            });
    }

    handleInputChange = (e) => {
        let input = e.target;
        let name = e.target.name;
        let value = input.value;

        this.setState({
            [name]: value
        });
    };

    render() {
        return (
            <div className="App">
                <Catgrid deleteCategory={this.deleteCategory} items={this.state.items} />
                <Form handleFormSubmit={this.handleFormSubmit}
                    handleInputChange={this.handleInputChange}
                    newUsername={this.state.category_name} />
            </div>
        );
    }
}

export default Categories;