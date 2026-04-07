'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container, Row, Col, Card, Button, Navbar, Nav } from 'react-bootstrap';
import { createClient } from '@/utils/supabase/client';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const LandingPage = () => {
  const [settings, setSettings] = useState({
    school_name: 'SIAKAD UNIVERSITAS',
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

  const roles = [
    { 
      title: 'Mahasiswa', 
      desc: 'Akses KRS, Nilai, dan Jadwal Kuliah', 
      icon: 'ri:user-smile-line', 
      color: 'primary',
      url: '/auth/login?role=mahasiswa'
    },
    { 
      title: 'Dosen', 
      desc: 'Input Nilai, Presensi, dan Materi Kuliah', 
      icon: 'ri:teacher-line', 
      color: 'success',
      url: '/auth/login?role=dosen'
    },
    { 
      title: 'Bendahara', 
      desc: 'Manajemen Keuangan dan Verifikasi Pembayaran', 
      icon: 'ri:wallet-3-line', 
      color: 'warning',
      url: '/auth/login?role=bendahara'
    },
    { 
      title: 'Administrator', 
      desc: 'Kelola Data Master dan Sistem Akademik', 
      icon: 'ri:admin-line', 
      color: 'danger',
      url: '/auth/login?role=admin'
    }
  ];

  return (
    <div className="bg-white min-vh-100">
      {/* Navigation */}
      <Navbar bg="white" expand="lg" className="border-bottom py-3 shadow-sm sticky-top">
        <Container>
          <Navbar.Brand href="/" className="d-flex align-items-center gap-2">
            <Image 
              src={settings.school_logo_url} 
              alt="Logo" 
              width={40} 
              height={40} 
              className="object-fit-contain"
            />
            <span className="fw-bold text-dark fs-4">{settings.school_name}</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Link href="/auth/login" className="btn btn-outline-primary px-4 rounded-pill fw-bold">
                Masuk ke Sistem
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6} className="mb-5 mb-lg-0">
              <h6 className="text-primary fw-bold text-uppercase mb-3 tracking-wider">Sistem Informasi Akademik Terpadu</h6>
              <h1 className="display-4 fw-bold mb-4 text-dark lh-sm">
                Solusi Digital Unggul untuk Masa Depan Pendidikan Anda
              </h1>
              <p className="lead text-muted mb-5 pe-lg-5">
                Kelola pendaftaran, perkuliahan, hingga pembayaran dalam satu platform yang aman, cepat, dan terintegrasi secara real-time.
              </p>
              <div className="d-flex gap-3">
                <Button variant="primary" size="lg" className="px-5 py-3 rounded-pill shadow-lg">
                  Mulai Sekarang
                </Button>
                <Button variant="outline-dark" size="lg" className="px-5 py-3 rounded-pill">
                  Pelajari Lebih Lanjut
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-center">
              <div className="position-relative">
                <div className="bg-primary opacity-10 position-absolute rounded-circle w-100 h-100 top-0 start-0 translate-middle-y"></div>
                <Image 
                  src="/globe.svg" 
                  alt="Academic" 
                  width={500} 
                  height={500} 
                  className="img-fluid position-relative z-1"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Login Portal Section */}
      <section className="py-5 border-top border-bottom">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="fw-bold fs-1 mb-3">Portal Akses Pengguna</h2>
            <p className="text-muted">Silakan pilih akses masuk sesuai dengan peran Anda di institusi</p>
          </div>
          <Row className="g-4">
            {roles.map((role, idx) => (
              <Col md={6} lg={3} key={idx}>
                <Card className="h-100 border-0 shadow-sm hover-translate-y transition-all">
                  <Card.Body className="p-4 text-center">
                    <div className={`avatar-lg mx-auto mb-4 bg-${role.color}-subtle rounded-circle d-flex align-items-center justify-content-center`}>
                      <IconifyIcon icon={role.icon} className={`fs-1 text-${role.color}`} />
                    </div>
                    <h4 className="fw-bold mb-2">{role.title}</h4>
                    <p className="text-muted small mb-4">{role.desc}</p>
                    <Link href={role.url} className={`btn btn-soft-${role.color} w-100 rounded-pill fw-bold`}>
                      Login {role.title}
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark text-white text-center">
        <Container>
          <p className="mb-0 opacity-75">
            &copy; {new Date().getFullYear()} {settings.school_name}. Seluruh Hak Cipta Dilindungi.
          </p>
        </Container>
      </footer>

      <style jsx>{`
        .hover-translate-y {
          transition: transform 0.3s ease;
        }
        .hover-translate-y:hover {
          transform: translateY(-10px);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
