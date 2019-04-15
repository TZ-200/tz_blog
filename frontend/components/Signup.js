import React, { Component } from 'react';
import { Mutation } from 'react-apollo'
import Error from './ErrorMessage'
import { SIGNUP, CURRENT_USER_QUERY } from './GQL'


class Signup extends Component {
    state = {
        name: '',
        email: '',
        password: ''
    }
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }


    /**
     * refetchQueries ⇒ 本命のクエリが成功したら続けて行われるクエリ
     */
    render() {
        return (
            <Mutation
                mutation={SIGNUP}
                variables={this.state}
                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
            >
                {(signup, { error, loading }) => {
                    return (
                        <form
                            method="post"   // defaultでGETなので必ずPOSTに（URL履歴にパスワード残っちゃうよ！）
                            onSubmit={ async e => {
                                e.preventDefault()
                                await signup()
                                this.setState({ name: '', email: '', password: '' })
                            }}
                        >
                            <fieldset 
                                disabled={loading}
                                aria-busy={loading}
                            >
                                <h2>Create your Account</h2>
                                <Error error={error}/>
                                
                                <label htmlFor="name">
                                    Name
                                    <input 
                                        type="text" 
                                        name = "name"
                                        placeholder="name"
                                        value={this.state.name}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                
                                <label htmlFor="email">
                                    Email
                                    <input 
                                        type="email" 
                                        name = "email"
                                        placeholder="email"
                                        value={this.state.email}
                                        onChange={this.saveToState}
                                    />
                                </label>
                               
                                <label htmlFor="password">
                                    Password
                                    <input 
                                        type="password" 
                                        name = "password"
                                        placeholder="password"
                                        value={this.state.password}
                                        onChange={this.saveToState}
                                    />
                                </label>
                                <button type="submit">Sign Up!</button>
                            </fieldset>
                        </form>
                    )           
                }}
            </Mutation>
        );
    }
}

export default Signup;