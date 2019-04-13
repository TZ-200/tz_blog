import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

const CURRENT_USER_QUERY = gql`
    query {
        me {
            id
            email
            name
            permissions
            cart {
                id
                quantity
                item {
                    id
                    price
                    image
                    title
                    description
                }
            }
        }
    }
`
/**
 * どっかのページで以下のように使用されたときに、
 * <User>
 *      { a function }
 * </User>
 * 
 * そのfunctionの引数にpayload、つまりme queryで取得したUserオブジェクトを渡す
 * 
 * Navで使われてます
 */

// Render prop component
const User = props => (
    <Query
        {...props}
        query={CURRENT_USER_QUERY}
    >
        {payload => props.children(payload)}
    </Query>
)

User.propTypes = {
    children: PropTypes.func.isRequired
}

export default User
export { CURRENT_USER_QUERY }