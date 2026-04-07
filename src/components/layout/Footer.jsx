'use client';

import { useState, useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { createClient } from '@/utils/supabase/client';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const developedBy = 'Coderthemes';
  const [schoolName, setSchoolName] = useState('SIAKAD');
  const supabase = createClient();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('school_name').single();
      if (data) setSchoolName(data.school_name);
    }
    fetchSettings();
  }, [supabase]);

  return (
    <footer className="footer">
      <Container fluid>
        <Row className="align-items-center">
          <Col md={6}>
            {currentYear} © {schoolName} - By <span className="fw-bold text-decoration-underline text-uppercase text-reset fs-12">{developedBy}</span>
          </Col>
          <Col md={6}>
            <div className="text-md-end footer-links d-none d-md-block">
              <a href="">About</a>
              <a href="">Support</a>
              <a href="">Contact Us</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
