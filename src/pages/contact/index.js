import React, { useState } from "react";
import * as emailjs from "emailjs-com";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { contactConfig } from "../../content_option";

export const ContactUs = () => {
  const [formData, setFormdata] = useState({
    email: "",
    name: "",
    message: "",
    loading: false,
    show: false,
    alertmessage: "",
    variant: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const LIMIT_MS = 60 * 60 * 1000;
    const lastSent = localStorage.getItem("contact_last_sent");
    if (lastSent && Date.now() - parseInt(lastSent, 10) < LIMIT_MS) {
      const minutesLeft = Math.ceil((LIMIT_MS - (Date.now() - parseInt(lastSent))) / 60000);
      setFormdata((prev) => ({
        ...prev,
        alertmessage: `Aguarde ${minutesLeft} minuto(s) antes de enviar novamente.`,
        variant: "warning",
        show: true,
      }));
      return;
    }

    setFormdata((prev) => ({ ...prev, loading: true }));

    const templateParams = {
      email: contactConfig.YOUR_EMAIL,
      name: formData.name,
      from_email: formData.email,
      message: formData.message,
    };

    const sendToMe = emailjs.send(
      contactConfig.YOUR_SERVICE_ID,
      contactConfig.YOUR_TEMPLATE_ID,
      templateParams,
      contactConfig.YOUR_USER_ID
    );

    const sendToRecruiter = emailjs.send(
      contactConfig.YOUR_SERVICE_ID,
      contactConfig.YOUR_TEMPLATE_AUTOREPLY_ID,
      templateParams,
      contactConfig.YOUR_USER_ID
    );

    Promise.all([sendToMe, sendToRecruiter])
      .then(() => {
        localStorage.setItem("contact_last_sent", Date.now().toString());
        setFormdata({
          email: "",
          name: "",
          message: "",
          loading: false,
          alertmessage: "SUCESSO! Obrigado pela sua mensagem.",
          variant: "success",
          show: true,
        });
      })
      .catch(() => {
        setFormdata((prev) => ({
          ...prev,
          loading: false,
          alertmessage: "Falha ao enviar. Tente novamente mais tarde.",
          variant: "danger",
          show: true,
        }));
        document.getElementsByClassName("co_alert")[0]?.scrollIntoView();
      });
  };

  const handleChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Contato</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Entre em Contato</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="12">
            <Alert
              variant={formData.variant}
              className={`rounded-0 co_alert ${
                formData.show ? "d-block" : "d-none"
              }`}
              onClose={() => setFormdata({ show: false })}
              dismissible
            >
              <p className="my-0">{formData.alertmessage}</p>
            </Alert>
          </Col>
          <Col lg="5" className="mb-5">
            <h3 className="color_sec py-4">Fale comigo</h3>
            <address>
              <strong>E-mail:</strong>{" "}
              <a href={`mailto:${contactConfig.YOUR_EMAIL}`}>
                {contactConfig.YOUR_EMAIL}
              </a>
              <br />
              <br />
              {contactConfig.hasOwnProperty("YOUR_FONE") ? (
                <p>
                  <strong>Telefone:</strong> {contactConfig.YOUR_FONE}
                </p>
              ) : (
                ""
              )}
            </address>
            <p>{contactConfig.description}</p>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <form onSubmit={handleSubmit} className="contact__form w-100">
              <Row>
                <Col lg="6" className="form-group">
                  <input
                    className="form-control"
                    id="name"
                    name="name"
                    placeholder="Nome"
                    value={formData.name || ""}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </Col>
                <Col lg="6" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="email"
                    name="email"
                    placeholder="E-mail"
                    type="email"
                    value={formData.email || ""}
                    required
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <textarea
                className="form-control rounded-0"
                id="message"
                name="message"
                placeholder="Mensagem"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <br />
              <Row>
                <Col lg="12" className="form-group">
                  <button className="btn ac_btn" type="submit" disabled={formData.loading}>
                    {formData.loading ? "Enviando..." : "Enviar"}
                  </button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
      <div className={formData.loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};
