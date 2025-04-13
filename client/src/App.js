import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import BookList from './components/BookList';
import Body from './components/Body'
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

const client = new ApolloClient(
  {
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache()
  }
)


function App() {
  
  // State để kiểm soát việc hiển thị form thêm sách
  



  return (
    <ApolloProvider client={client}>
      
      <Container className="py-3 mt-3" style={{ backgroundColor: '#E8F6F3'}}>
        <h1 className="text-center text-info mb-4" style={{ fontFamily: 'Roboto, sans-serif' }}>Sách Summer</h1>
        <Body/>
        {/* Gọi BookList component */}
        
      </Container>
    </ApolloProvider>
  );

}

export default App;
