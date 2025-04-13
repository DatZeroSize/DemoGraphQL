import React, { useState } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { getNameAuthors } from '../graphql-client/queries';
import { createAuthor } from '../graphql-client/mutations';
import { createBook } from '../graphql-client/mutations';
import BookList from './BookList';
import { getBooks } from '../graphql-client/queries'; 
const Body = () => {
  const [showBookForm, setShowBookForm] = useState(false);
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [selectedAuthorIdAdd, setselectedAuthorIdAdd] = useState(null);

  // Khai báo useQuery và useMutation
  const { loading, error, data, refetch } = useQuery(getNameAuthors);
  const { refetch: refetchBookList } = useQuery(getBooks);
  const [createAuthorMutation] = useMutation(createAuthor, {
    onCompleted: () => {
      refetch();  // Sau khi thêm tác giả thành công, gọi lại API để lấy dữ liệu mới nhất
      setShowAuthorForm(false); // Đóng form sau khi thêm thành công
    },
    onError: (error) => {
      console.error('Thêm tác giả thất bại:', error);
    }
  });

  const handleAuthorSelect = (event) => {
    const authorId = event.target.value;
    setSelectedAuthorId(authorId);
  };
  const handleAuthorSelectAdd = (event) => {
    const authorId = event.target.value;
    setselectedAuthorIdAdd(authorId);
    console.log(authorId)
  };

  const handleAddAuthorSubmit = (event) => {
    event.preventDefault(); // Ngừng hành động mặc định của form

    const { name, year, content, image } = event.target;

    // Gọi mutation tạo tác giả
    createAuthorMutation({
      variables: {
        name: name.value,
        year: year.value,
        content: content.value,
        image: image.value,
      },
    });
  };

  const [createBookMutation] = useMutation(createBook, {
    onCompleted: () => {
      refetchBookList(); // gọi refetch danh sách sách trực tiếp
      setShowBookForm(false);
    },
    onError: (error) => {
      console.error('Thêm sách thất bại:', error.message);
    }
  });
  const handleAddBookSubmit = (event) => {
    event.preventDefault(); // Ngừng hành động mặc định của form

    const { name, content, year, genre, image } = event.target;

    // Kiểm tra lại giá trị authorId
    console.log('Selected authorId:', selectedAuthorIdAdd); // In ra giá trị để kiểm tra

    // Gọi mutation tạo sách
    createBookMutation({
      variables: {
        name: name.value,
        content: content.value,
        year: year.value,
        genre: genre.value,
        image: image.value,
        authorId: selectedAuthorIdAdd,  // Truyền selectedAuthorIdAdd vào mutation
      },
    });
  };




  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <div>
      <Row className="mb-3" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <Col md={3} sm={4} className="mb-4">
          <Form.Group controlId="authorSelect">
            <Form.Label style={{ fontWeight: 'bold', color: '#00bfff', marginLeft: '0px' }}>Chọn tác giả</Form.Label>
            <Form.Control onChange={handleAuthorSelect} as="select" style={{ backgroundColor: '#f0f8ff', borderColor: '#00bfff' }}>
              <option disabled selected value="">Chọn tác giả</option>
              {data.authors.map((author) => (
                <option value={author.id} key={author.id}>{author.name}</option>
              ))}
              <option value="">...</option>
            </Form.Control>
          </Form.Group>
        </Col>

        {/* Nút "Thêm sách" và "Thêm tác giả" gần nhau */}
        <Col md={2} sm={3} className="mb-1 pr-1" style={{ width: 'auto' }}>
          <Button variant="primary" size="lg" block style={{ backgroundColor: '#00bfff', borderColor: '#00bfff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} onClick={() => setShowBookForm(true)}>
            Thêm sách
          </Button>
        </Col>

        <Col md={2} sm={3} className="mb-1 pl-1" style={{ width: 'auto' }}>
          <Button variant="secondary" size="lg" block style={{ backgroundColor: '#00bfff', borderColor: '#00bfff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} onClick={() => setShowAuthorForm(true)}>
            Thêm tác giả
          </Button>
        </Col>
      </Row>
      {/* Modal hiển thị form khi nhấn nút "Thêm sách" */}
      <Modal show={showBookForm} onHide={() => setShowBookForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddBookSubmit}>
            <Form.Group controlId="bookTitle">
              <Form.Label>Tiêu đề sách</Form.Label>
              <Form.Control name="name" type="text" placeholder="Nhập tên sách" style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }} />
            </Form.Group>

            <Form.Group controlId="bookContent">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control name="content" type="text" placeholder="Nhập nội dung" style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }} />
            </Form.Group>

            <Form.Group controlId="bookYear">
              <Form.Label>Năm xuất bản</Form.Label>
              <Form.Control name="year" type="text" placeholder="Nhập năm xuất bản" style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }} />
            </Form.Group>

            <Form.Group controlId="bookAuthor">
              <Form.Label>Tác giả</Form.Label>
              <Form.Control
                as="select"
                name="authorId"
                value={selectedAuthorIdAdd} // Đảm bảo giá trị được chọn
                onChange={handleAuthorSelectAdd} // Khi chọn tác giả, cập nhật selectedAuthorId
                style={{ backgroundColor: '#f0f8ff', borderColor: '#00bfff' }}
              >
                <option disabled selected value="">
                  Chọn tác giả
                </option>
                {data.authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>


            <Form.Group controlId="bookGenre">
              <Form.Label>Thể loại</Form.Label>
              <Form.Control name="genre" type="text" placeholder="Nhập thể loại" style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }} />
            </Form.Group>

            <Form.Group controlId="bookImage">
              <Form.Label>Ảnh</Form.Label>
              <Form.Control name="image" type="text" placeholder="Nhập đường dẫn ảnh" style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }} />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit" style={{ marginTop: '10px', borderRadius: '5px', padding: '10px', backgroundColor: '#00bfff', borderColor: '#00bfff' }}>
                Thêm sách
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Modal hiển thị form khi nhấn nút "Thêm tác giả" */}
      <Modal show={showAuthorForm} onHide={() => setShowAuthorForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm tác giả</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddAuthorSubmit}>
            <Form.Group controlId="authorName">
              <Form.Label>Tên tác giả</Form.Label>
              <Form.Control name="name" type="text" placeholder="Nhập tên tác giả" style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }} />
            </Form.Group>

            <Form.Group controlId="authorBirthYear">
              <Form.Label>Năm sinh</Form.Label>
              <Form.Control name="year" type="text" placeholder="Nhập năm sinh" style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }} />
            </Form.Group>

            <Form.Group controlId="authorContent">
              <Form.Label>Nội dung</Form.Label>
              <Form.Control name="content" type="text" placeholder="Nhập nội dung" style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }} />
            </Form.Group>

            <Form.Group controlId="authorImage">
              <Form.Label>Ảnh</Form.Label>
              <Form.Control name="image" type="text" placeholder="Chèn đường dẫn" style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }} />
            </Form.Group>

            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit" style={{ marginTop: '10px', borderRadius: '5px', padding: '10px', backgroundColor: '#00bfff', borderColor: '#00bfff' }}>
                Thêm tác giả
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <BookList selectedAuthorId={selectedAuthorId} />
    </div>
  );
};

export default Body;
