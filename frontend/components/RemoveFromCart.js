import React from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
    font-size: 3rem;
    background: none;
    border: 0;
    &:hover {
        color: ${props => props.theme.red};
        cursor: pointer;
    }
`

class RemoveFromCart extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }

    // This gets called as soon as we get a rsponse back from the server after a mutation has been performed 
    // cache: Apollo Clientのcache
    // payload: mutationの返り値
    update = (cache, payload) => {
        // Read the cache
        const data = cache.readQuery({ query: CURRENT_USER_QUERY })
        // Remove that item from the cart
        const cartItemId = payload.data.removeFromCart.id
        data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId)
        // Write it back to the cache
        cache.writeQuery({ query: CURRENT_USER_QUERY, data })
    }


    /**
     * OptimisticResponse
     * 本来クエリを実行してサーバーからのレスポンスを受け取ったのちにUIの更新をする。
     * しかし、少なくとも幾ばくかの時間がかかる。
     * そこでクエリの実行が成功すると仮定して、サーバーのレスポンスデータを予想して予め渡しておくことで、
     * サーバーからのレスポンスを実際に待たずにUIを更新する
     * ⇒ スナッピー！！！
     */
    render(){
        return (
            <Mutation 
                mutation={REMOVE_FROM_CART_MUTATION}
                variables={{ id: this.props.id }}  
                update={this.update}
                optimisticResponse={{
                    __typename: 'Mutation', 
                    removeFromCart: {
                        __typename: 'CartItem',
                        id: this.props.id
                    }
                }}
            >
                {(removeFromCart, { loading, error }) => (
                    <BigButton
                        disabled={loading}
                        title="Delete Item"
                        onClick={() => {
                            removeFromCart()
                            .catch(err => alert(err.message))
                        }}
                    >
                        &times;
                    </BigButton>
                )}
            </Mutation>
        )
    }
}

export default RemoveFromCart