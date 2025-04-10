'use client'

import { ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql', // Railsサーバーが起動しているURL
  cache: new InMemoryCache(),
})

export default client
