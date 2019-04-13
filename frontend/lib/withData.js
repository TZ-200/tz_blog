import withApollo from 'next-with-apollo';  // a high-order component that will expose our ApolloClient. Nextjs(SSR)特有のライブラリ
import ApolloClient from 'apollo-boost';    // apolloclient + some extra functions ツールがセットになったApolloCliient
import { endpoint, prodEndpoint } from '../config';       
import { LOCAL_STATE_QUERY } from '../components/Cart'

// Client をreturn
function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint,  // ClientのURL
    request: operation => {   // like a express middleware
      operation.setContext({
        fetchOptions: {
          credentials: 'include',   // JWTが存在したらそれもBackendに送信する
        },
        headers,
      });
    },

    // Local data
    // Hot Reloadはないので一々リロードしてください   
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart( _, variables, { cache } ){
            // Read the cartOpen value from the cache
            const { cartOpen } = cache.readQuery({
              query: LOCAL_STATE_QUERY
            })
            // Write the cart State to the opposite
            const data = {
              data: { cartOpen: !cartOpen }
            }
            cache.writeData(data)
            return data
          }
        }
      },
      defaults: {
        cartOpen: false
      }
    }
  });
}

export default withApollo(createClient);


/**
 * Apollo client is a a kind of database that is in the client
 */