import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import Error from './ErrorMessage'
import Router from 'next/router'
import { CREATE_THREAD } from './GQL'

class CreateThread extends Component {
    
    state = {}

    handleChange = (e) => {
        const { name, type, value } = e.target
        const val = type === 'number' ? parseFloat(value) : value
        this.setState({ [name]: val})
    }

  render() {
    return (
        <Mutation 
            mutation={CREATE_THREAD}
            variables={this.state}
        >
            {(createThread, { loading, error }) => (

                <form 
                    method="post" 
                    onSubmit={ async e => {
                        e.preventDefault()
                        const res = await createThread()
                        Router.push({
                            pathname: '/'
                        })
                    }}
                >
                <Error error={error} /> 

                <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                        Title
                        <input 
                            type="text" 
                            id="title" 
                            name="title" 
                            placeholder="Title" 
                            required 
                            onChange={this.handleChange} 
                        />
                    </label>
                
                    <label htmlFor="text">
                        Text
                        <input 
                            type="text" 
                            id="text" 
                            name="text" 
                            placeholder="text" 
                            required 
                            onChange={this.handleChange} 
                        />
                    </label>

                    <button type="submit">投稿</button>
                </fieldset>
                </form>
            )}
        </Mutation>
    );
  }
}

export default CreateThread