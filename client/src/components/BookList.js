import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Form } from 'react-bootstrap';

import { useQuery } from '@apollo/client'
import { getBooks } from '../graphql-client/queries'

import { useMutation } from '@apollo/client';
import { deleteBookById } from '../graphql-client/mutations';
import { updateBook } from '../graphql-client/mutations';
import { updateAuthor } from '../graphql-client/mutations';

const BookList = ({ selectedAuthorId }) => {

    // sách chọn
    const [selectedBook, setSelectedBook] = useState(null);
    // xem thông tin sách
    const [showBookModal, setShowBookModal] = useState(false);
    // form cập nhật sách
    const [showBookForm, setShowBookForm] = useState(false);
    // form cập nhật tác giả
    const [showAuthorForm, setShowAuthorForm] = useState(false);

    const [updateAuthorMutation] = useMutation(updateAuthor);

    const handleCloseBookForm = () => setShowBookForm(false);

    const handleCloseAuthorForm = () => setShowAuthorForm(false);

    // xóa sách
    const handleDeleteBook = async () => {
        try {
            await deleteBook({ variables: { id: selectedBook.id } }); // Gọi mutation xóa sách
            console.log('Sách đã được xóa:', selectedBook.id);
            setShowBookModal(false); // Đóng modal sau khi xóa
        } catch (error) {
            console.error('Xóa sách thất bại:', error);
        }
    };

    const handleUpdateAuthor = async (e) => {
        e.preventDefault(); // Ngừng hành động mặc định của form

        // Lấy giá trị từ các trường trong form
        const { name, content, year, image } = e.target;

        try {
            await updateAuthorMutation({
                variables: {
                    
                    id: selectedBook.author.id,
                    name: name.value,        
                    content: content.value,         
                    year: year.value,
                    image: image.value      
                }
            });
            refetch();
            console.log("Cập nhật tác giả thành công!");
            setShowAuthorForm(false);
            setShowBookModal(false);
        } catch (error) {
            console.error("Cập nhật tác giả thất bại:", error);
        }
    };

    // Hàm xử lý form submit để cập nhật sách
    const handleUpdateBook = (e) => {
        e.preventDefault(); // Ngừng hành động mặc định của form

        // Lấy giá trị từ các trường trong form
        const { name, content, year, genre, image } = e.target;

        // Gọi mutation để cập nhật sách
        updateBookMutation({
            variables: {
                id: selectedBook.id,  // Lấy id từ sách được chọn
                name: name.value,      // Lấy giá trị name
                content: content.value, // Lấy giá trị content
                year: year.value,      // Lấy giá trị year
                genre: genre.value,    // Lấy giá trị genre
                image: image.value     // Lấy giá trị image
            }
        }).then(() => {
            console.log("Cập nhật sách thành công!");

            refetch();
            setShowBookForm(false);  // Đóng modal sau khi cập nhật
            setShowBookModal(false);
        }).catch((error) => {
            console.error("Cập nhật sách thất bại:", error);
        });
    };

    //chọn sách
    const handleCardClick = (book) => {
        setSelectedBook(book);
        setShowBookModal(true);
    };

    // đóng sách
    const handleCloseBook = () => {
        setSelectedBook(null);
        setShowBookModal(false);
    };

    // useMutation hook để gọi mutation
    const [updateBookMutation] = useMutation(updateBook, {
        onCompleted: () => {
            console.log('Sách đã được cập nhật');
            // setShowBookModal(false);
            refetch();
            setShowBookForm(false);  // Đóng form sau khi cập nhật
        },
        onError: (error) => {
            console.error('Cập nhật sách thất bại:', error);
        }
    });

    const [deleteBook] = useMutation(deleteBookById, {
        onCompleted: () => {
            refetch();  // Sau khi xóa, gọi refetch lại danh sách sách
        }
    });

    const { loading, error, data, refetch } = useQuery(getBooks)

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error...</p>
    const filteredBooks = selectedAuthorId 
    ? data.books.filter((book) => book.author.id === selectedAuthorId) 
    : data.books;


    return (
        <div style={{ padding: '10px' }}>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '15px',
                    padding: '20px',
                }}
            >
                {filteredBooks.map((book) => (
                    <Card
                        border='info'
                        text='info'
                        key={book.id}
                        className='text-center shadow'
                        onClick={() => handleCardClick(book)}
                        style={{
                            cursor: 'pointer',
                            width: '180px',
                            height: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            backgroundImage: `url(${book.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div
                            style={{
                                background: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                padding: '10px',
                            }}
                        >
                            <strong>{book.name}</strong>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Modal sách + tác giả */}
            <Modal show={showBookModal} onHide={handleCloseBook} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title
                        style={{
                            textAlign: 'center', // Căn giữa tiêu đề
                            fontSize: '28px', // Kích thước chữ lớn hơn
                            fontWeight: '600', // Trọng số chữ đậm
                            color: '#333', // Màu sắc chữ
                            width: '100%', // Đảm bảo tiêu đề chiếm toàn bộ chiều rộng
                            margin: '0 auto' // Tạo khoảng cách tự động để căn giữa
                        }}
                    >
                        {selectedBook?.name}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {/* Bên trái: ảnh và mô tả sách */}
                        <div style={{ flex: '1 1 300px' }}>
                            <img
                                src={selectedBook?.image}
                                alt={selectedBook?.name}
                                style={{
                                    width: '100%',
                                    maxHeight: '250px',
                                    objectFit: 'cover',
                                    borderRadius: '10px',
                                    marginBottom: '10px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                                }}
                            />

                            <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                                <h5 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>Nội dung:</h5>
                                <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6' }}>{selectedBook?.content}</p>

                                <hr style={{ margin: '20px 0', borderTop: '1px solid #ddd' }} /> {/* Đường ngăn cách */}

                                <h5 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>Thể loại:</h5>
                                <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6' }}>{selectedBook?.genre}</p>

                                <hr style={{ margin: '20px 0', borderTop: '1px solid #ddd' }} />

                                <h5 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '10px' }}>Năm xuất bản:</h5>
                                <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6' }}>{selectedBook?.year}</p>
                            </div>

                        </div>

                        {/* Bên phải: card thông tin tác giả */}
                        <div
                            style={{
                                flex: '1 1 250px',
                                backgroundColor: '#f9f9f9',
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                minWidth: '240px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '15px',
                            }}
                        >
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                {/* Hiển thị ảnh tác giả */}
                                <div
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',  // Đảm bảo ảnh không bị tràn
                                        backgroundColor: '#ddd',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {/* Nếu có ảnh tác giả */}
                                    {selectedBook?.author?.image ? (
                                        <img
                                            src={selectedBook?.author?.image}
                                            alt={selectedBook?.author?.name}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        // Nếu không có ảnh thì hiển thị chữ cái đầu
                                        <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#555' }}>
                                            {selectedBook?.author?.name.charAt(0)}
                                        </span>
                                    )}
                                </div>

                                {/* Thông tin tác giả */}
                                <div style={{ flex: '1' }}>
                                    <p style={{ margin: 0, fontWeight: 600, fontSize: '16px' }}>
                                        {selectedBook?.author?.name}
                                    </p>
                                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#777' }}>
                                        <strong>Năm sinh:</strong> {selectedBook?.author?.year}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>Tiểu sử:</h5>
                                <p style={{ fontSize: '14px', color: '#333' }}>
                                    {selectedBook?.author?.content}
                                </p>
                            </div>

                            <div>
                                <h5 style={{ fontSize: '16px', fontWeight: 600, color: '#333' }}>Các tác phẩm:</h5>
                                <p style={{ fontSize: '14px', color: '#333' }}>
                                    {selectedBook?.author?.books?.map((book, index) => (
                                        index === selectedBook.author.books.length - 1 ? `${book.name}.` : `${book.name}, `
                                    ))}
                                </p>
                            </div>
                        </div>


                    </div>
                </Modal.Body>



                <Modal.Footer>
                    <Button
                        variant="warning"
                        onClick={() => setShowBookForm(true)}
                        style={{ marginRight: '8px' }}
                    >
                        Sửa sách
                    </Button>

                    <Button
                        variant="info"
                        onClick={() => setShowAuthorForm(true)}
                        style={{ marginRight: '8px' }}
                    >
                        Sửa tác giả
                    </Button>

                    {/* Nút "Xóa sách" */}
                    <Button
                        variant="danger"
                        onClick={handleDeleteBook}
                        style={{ marginRight: 'auto' }}
                    >
                        Xóa sách
                    </Button>

                    <Button variant="secondary" onClick={handleCloseBook}>
                        Đóng
                    </Button>
                </Modal.Footer>


            </Modal>
            {/* Modal sửa sách */}
            <Modal show={showBookForm} onHide={handleCloseBookForm} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa sách</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateBook}>
                        <Form.Group controlId="bookTitle">
                            <Form.Label>Tiêu đề sách</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                defaultValue={selectedBook?.name}
                                placeholder="Nhập tên sách"
                                style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="bookContent">
                            <Form.Label>Nội dung</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={selectedBook?.content}
                                name="content"
                                placeholder="Nhập nội dung"
                                style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="bookYear">
                            <Form.Label>Năm xuất bản</Form.Label>
                            <Form.Control
                                type="text"
                                name="year"
                                defaultValue={selectedBook?.year}
                                placeholder="Nhập năm xuất bản"
                                style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="bookGenre">
                            <Form.Label>Thể loại</Form.Label>
                            <Form.Control
                                type="text"
                                defaultValue={selectedBook?.genre}
                                name="genre"
                                placeholder="Nhập thể loại"
                                style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="bookImage">
                            <Form.Label>Ảnh</Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                defaultValue={selectedBook?.image}
                                placeholder="Nhập đường dẫn ảnh"
                                style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button
                                variant="primary"
                                type="submit"
                                style={{
                                    marginTop: '10px',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    backgroundColor: '#00bfff',
                                    borderColor: '#00bfff',
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showAuthorForm} onHide={handleCloseAuthorForm} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa tác giả</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateAuthor}>
                        <Form.Group controlId="authorName">
                            <Form.Label>Tên tác giả</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                defaultValue={selectedBook?.author?.name}
                                placeholder="Nhập tên tác giả"
                                style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="authorYear">
                            <Form.Label>Năm sinh</Form.Label>
                            <Form.Control
                                defaultValue={selectedBook?.author?.year}
                                type="text"
                                name="year"
                                placeholder="Nhập năm sinh"
                                style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="authorContent">
                            <Form.Label>Tiểu sử</Form.Label>
                            <Form.Control
                                type="text"
                                name="content"
                                defaultValue={selectedBook?.author?.content}
                                placeholder="Nhập nội dung"
                                style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }}
                            />
                        </Form.Group>

                        <Form.Group controlId="authorContent">
                            <Form.Label>Ảnh</Form.Label>
                            <Form.Control
                                name="image"
                                type="text"
                                defaultValue={selectedBook?.author?.image}
                                placeholder="Chèn đường dẫn"
                                style={{ borderRadius: '5px', padding: '10px', borderColor: '#00bfff' }}
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button
                                variant="primary"
                                type="submit"
                                style={{
                                    marginTop: '10px',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    backgroundColor: '#00bfff',
                                    borderColor: '#00bfff',
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default BookList;
