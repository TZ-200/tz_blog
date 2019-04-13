import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'
import Router from 'next/router'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
    
    state = {
        title: 'Cool Shoes',
        description: 'aaa',
        image: '',
        largeImage: '',
        price: 0
    }
    
    handleChange = (e) => {
        const { name, type, value } = e.target
        const val = type === 'number' ? parseFloat(value) : value
        this.setState({ [name]: val})
    }

    uploadFile = async e => {
        const files = e.target.files
        const data = new FormData()     // Javascriptの標準api（データを扱うための）
        data.append('file', files[0])
        data.append('upload_preset', 'sickfits')

        const res = await fetch('https://api.cloudinary.com/v1_1/decov9fyl/image/upload', {
            method: 'POST',
            body: data
        })
        const file = await res.json()
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        })
        
    }



    // mutation で エラーが発生したら<Error/>がrenderされる
    // mutation　処理中はinputをいじれないようにfieldsetをdisableにして、かつローディングアニメーションであるaria-busyをtrueにする
    render() {
        return (
            <Mutation 
                mutation={CREATE_ITEM_MUTATION}
                variables={this.state}
            >
                {(createItem, { loading, error }) => (

                    <Form 
                        onSubmit={ async e => {
                            e.preventDefault(); //URLにパラメータがくっつくやつをとめる (stop form from submitting)
                            const res = await createItem()  // call the mutation
                            Router.push({
                                pathname: '/item',
                                query: { id: res.data.createItem.id }
                            })  // change them to the single item page
                            
                        }}
                    >
                        <Error error={error} />  
                        <fieldset disabled={loading} aria-busy={loading}>

                            <label htmlFor="file">
                                Image
                                <input 
                                    type="file" 
                                    id="file" 
                                    name="file" 
                                    placeholder="Upload an image" 
                                    required 
                                    onChange={this.uploadFile} 
                                />
                                {this.state.image && <img width="200" src={this.state.image} alt="Upload Preview"/>}
                            </label>

                            <label htmlFor="title">
                                Title
                                <input 
                                    type="text" 
                                    id="title" 
                                    name="title" 
                                    placeholder="Title" 
                                    required 
                                    value={this.state.title}
                                    onChange={this.handleChange} 
                                />
                            </label>
                        
                            <label htmlFor="price">
                                Price
                                <input 
                                    type="number" 
                                    id="price" 
                                    name="price" 
                                    placeholder="Price" 
                                    required 
                                    value={this.state.price}
                                    onChange={this.handleChange} 
                                />
                            </label>

                            <label htmlFor="description">
                                Description
                                <textarea
                                    id="description" 
                                    name="description" 
                                    placeholder="Enter a Description" 
                                    required 
                                    value={this.state.description}
                                    onChange={this.handleChange} 
                                />
                            </label>

                            <button type="submit">Submit</button>

                        </fieldset>

                    </Form>
                )}

            </Mutation>
        );
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };