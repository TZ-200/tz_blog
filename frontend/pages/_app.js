import App, { Container } from 'next/app'
import Page from '../components/Page'
import { ApolloProvider } from 'react-apollo'
import withData from '../lib/withData'      // a high-order component

class MyApp extends App {

    // getInitialPropsはnextjsのlifecyclemethod
    // render前に実行されて、return valueはrenderでthis.propsから取得できる
    static async getInitialProps({ Component, ctx }){
        let pageProps = {}

        // いかなるComponentであったとしても、renderが実行される前にGraphQLクエリを実行して、
        // クエリのawaitが終わるまではrenderが始まらないようにする（SSR）
        // fetchしたデータはpagePropsとしてreturnする
        if(Component.getInitialProps){
            pageProps = await Component.getInitialProps(ctx)
        }
        // this exposes the query to the user
        pageProps.query = ctx.query
        return { pageProps }
    }
    
    render() {
        const { Component, apollo, pageProps } = this.props

        return (
            <Container>
                <ApolloProvider client={apollo}>
                    <Page>            
                        <Component {...pageProps}/>
                    </Page>
                </ApolloProvider>
            </Container>
        )

    }
}

// make the Apllo Client accessible via this.props
export default withData(MyApp)

/**
 * 
 */