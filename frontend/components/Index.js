import React, { Component } from 'react';
import { Query } from 'react-apollo'
import { THREADS_QUERY } from './GQL'


class Index extends Component {
    render() {
        return (
            <div>
                <Query 
                    query={THREADS_QUERY}
                >
                    { ({ data, error, loading }) => {
                        if(loading) return <p>Loading...</p>
                        if(error) return <p>Error: {error.message}</p>
                        return (
                            <div>
                            {
                                data.threads.map(thread => <div key={thread.id}>{thread.id}</div>)
                            }
                            </div>
                        )
                        
                    }}
                </Query>
            </div>
        );
    }
}

export default Index;