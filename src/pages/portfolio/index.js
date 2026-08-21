import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { dataportfolio, meta } from "../../content_option";

export const Portfolio = () => {
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Portfólio</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4"> Portfólio </h1>{" "}
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <div className="mb-5 po_items_ho">
          {dataportfolio.map((data, i) => (
            <div key={i} className="po_item">
              <div className="po_item__techs">
                {data.techs.map((tech, j) => (
                  <img
                    key={j}
                    src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${tech.icon}/${tech.icon}-${tech.variant}.svg`}
                    alt={tech.icon}
                    title={tech.icon}
                    className="tech_icon"
                  />
                ))}
              </div>
              <h5 className="po_item__title">{data.title}</h5>
              <p className="po_item__desc">{data.description}</p>
              {data.link !== "#" && (
                <a href={data.link} target="_blank" rel="noreferrer" className="po_item__link">
                  Ver projeto
                </a>
              )}
            </div>
          ))}
        </div>
      </Container>
    </HelmetProvider>
  );
};
