import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'


// Create the apollo provider
const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    link: new HttpLink({
      // You should use an absolute URL here
      uri: 'https://www.mywsq.cn/graphql'
    }),
    cache: new InMemoryCache(),
    connectToDevTools: true
  })
})

// leave the export, even if you don't use it
export default ({ app, Vue }) => {
  // something to do
  Vue.use(VueApollo)
  app.provide = apolloProvider.provide()
}
