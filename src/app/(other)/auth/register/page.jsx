'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { createClient } from '@/utils/supabase/client';
import RegisterForm from './components/RegisterForm';

const RegisterPage = () => {
  const [settings, setSettings] = useState({
    school_name: 'SIAKAD',
    school_logo_url: '/Wikimedia-logo.png'
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
    }
    fetchSettings();
  }, [supabase]);

  return (
    <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center bg-light">
      <Container>
        <Row className="justify-content-center w-100 mx-auto">
          <Col xl={4} lg={5} md={7}>
            <Card className="overflow-hidden rounded-4 border-0 shadow-lg">
              <Card.Body className="p-4 p-xl-5">
                <div className="text-center mb-4">
                  <Link href="/" className="d-inline-block mb-3">
                    <Image 
                      src={settings.school_logo_url} 
                      alt="Logo" 
                      height={60} 
                      width={60} 
                      className="object-fit-contain"
                    />
                  </Link>
                  <h4 className="fw-bold mb-1 fs-22">{settings.school_name}</h4>
                  <p className="text-muted">Pendaftaran Akun Baru Sistem Akademik</p>
                </div>

                <div className="alert alert-info border-0 small mb-4">
                  <i className="ri:information-line me-1"></i>
                  Pendaftaran pertama pada sistem ini akan otomatis mendapatkan akses <strong>Administrator</strong>.
                </div>

                <RegisterForm />

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Sudah memiliki akun? 
                    <Link href="/auth/login" className="text-primary fw-bold ms-1">
                      Masuk Sekarang
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
            
            <p className="mt-4 text-center text-muted small mb-0">
              &copy; {new Date().getFullYear()} {settings.school_name}. Seluruh Hak Cipta Dilindungi.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default RegisterPage;
