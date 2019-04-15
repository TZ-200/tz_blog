import gql from 'graphql-tag'


const THREADS_QUERY = gql`
    query {
        threads {
            id
            title
        }
    }
`

const CREATE_THREAD = gql`
    mutation CREATE_THREAD (
        $title: String!,
        $text: String!,
        $image: String
    ) {
        createThread (
            title: $title,
            text: $text,
            image: $image,
        ){
            id
        }
    }
`

const SIGNUP = gql`
    mutation SIGNUP (
        $name: String!,
        $email: String!,
        $password: String!
    ) {
        signup (
            name: $name,
            email: $email,
            password: $password
        ){
            id
            email
        }
    }
`

const CURRENT_USER_QUERY = gql`
    query {
        me {
            id
            email
        }
    }
`

export { THREADS_QUERY, CREATE_THREAD, SIGNUP, CURRENT_USER_QUERY }