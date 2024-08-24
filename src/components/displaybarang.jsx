import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Card, InputGroup } from "react-bootstrap";
import axios from "axios";
import serverDev from "../Server";
import DetailProducts from "../views/ui/forms/DetailProduct";

const DisplayBarang = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch all products from API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${serverDev}stuff`);
        setProducts(response.data.data);
        setFilteredProducts(response.data.data); // Initialize filteredProducts with all products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name_stuff.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <Container id="products" className="py-5" style={{ marginTop: "80px" }}>
      <h2 className="text-center mb-4">Search Products</h2>
      <Row>
        <Col sm={6} md={12} lg={12}>
          <Form>
            <InputGroup
              className="mb-4"
              style={{ margin: "auto", marginBottom: "20px", width: "60%" }}
            >
              <Form.Control
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ textAlign: "center" }}
              />
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col
              key={product.id}
              sm={6}
              md={4}
              lg={3}
              className="mb-4"
              style={{ marginBottom: "30px" }}
            >
              <Card className="h-100 shadow-sm border">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name_stuff}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="mb-2">{product.name_stuff}</Card.Title>
                  <Card.Text className="text-muted mb-4">
                    ${product.price.toFixed(2)}
                  </Card.Text>
                  <div className="mt-auto">
                    <DetailProducts detailprops={product} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <p className="text-center">No products found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default DisplayBarang;
