import { useContext, useEffect, useState } from "react";
import { Col, Container, Image, Row, Table } from "react-bootstrap";
import { CatContext } from "../contexts/CatContext";
import { Modal } from "react-bootstrap";

import CustomPagination from "./CustomPagination";
import { getFetch } from "../services/api";
import { useCallback } from "react";
import debounce from "../utils/debounce";
import CatDetails from "./CatDetails";

const CatList = () => {
  const { cats, setCats, currentCat, setCurrentCat } = useContext(CatContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  const catsPerPage = 10;

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const handleClose = () => {
    setCurrentCat(null);
  };

  const fetchData = useCallback(
    async (params = { limit: 10, page: 1, order: "desc" }) => {
      try {
        const response = await getFetch(
          "https://api.thecatapi.com/v1/images/search",
          params
        );

        const totalRows = response?.headers?.get("pagination-count");
        const totalPages = Math.floor(totalRows / params?.limit);
        setMaxPages(totalPages);
        const result = await response.json();
        setCats(result);
      } catch (error) {
        setMaxPages(0);
        setCats([]);
      }
    },
    [setCats]
  );

  useEffect(() => {
    debounce(() => {
      fetchData({ limit: catsPerPage, page: currentPage, order: "desc" });
    }, 500)();
  }, [currentPage, fetchData]);

  return (
    <Container fluid="md" className="mt-5">
      {cats.length >= 1 && (
        <>
          <Row className="justify-content-center">
            <CustomPagination
              setCurrentPage={handlePageChange}
              currentPage={currentPage}
              totalPages={maxPages}
            />
          </Row>
          <Row className="justify-content-center p-5">
            <Col>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Picture</th>
                  </tr>
                </thead>
                <tbody>
                  {cats.map((cat) => (
                    <tr
                      onClick={() => {
                        setCurrentCat(cat);
                      }}
                      key={`${cat.id}-key`}
                    >
                      <td> ${cat.id} </td>
                      <td>
                        <div className="center">
                          <Image
                            key={`${cat.id}-key-img`}
                            className="w-50"
                            fluid
                            thumbnail
                            src={cat.url}
                            alt={`${cat.id}-img`}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </>
      )}

      {cats.length <= 0 && (
        <Row className="justify-content-center">Fetching Data...</Row>
      )}

      {currentCat && <Modal show={currentCat !== null} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title> <h1>Cat Details</h1></Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <CatDetails cat={currentCat} />
        </Modal.Body>
      </Modal>}
    </Container>
  );
};

export default CatList;
