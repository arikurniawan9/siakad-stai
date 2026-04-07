'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, Col, Row } from 'react-bootstrap';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { currentYear } from '@/context/constants';

const LogoutPage = () => {
  const supabase = createClient();
  const [schoolName, setSchoolName] = useState('SIAKAD');

  useEffect(() => {
    async function handleLogout() {
      // 1. Fetch settings for school name
      const { data: settings } = await supabase.from('settings').select('school_name').single();
      if (settings) setSchoolName(settings.school_name);

      // 2. Perform Supabase SignOut
      await supabase.auth.signOut();
      
      // 3. Clear any local storage if necessary
      localStorage.removeItem('sb-swdgtxkeemdrmqaecvhb-auth-token');
    }
    handleLogout();
  }, [supabase]);

  return (
    <div className="h-100">
      <div className="auth-bg d-flex min-vh-100 justify-content-center align-items-center">
        <Row className="g-0 justify-content-center w-100 m-xxl-5 px-xxl-4 m-3">
          <Col xl={3} lg={4} md={6}>
            <Card className="overflow-hidden text-center rounded-4 p-xxl-4 p-3 mb-0 shadow-lg border-0">
              <div className="mb-4">
                 <IconifyIcon icon="ri:checkbox-circle-line" className="text-success display-1" />
              </div>
              
              <h4 className="fw-bold mb-2 fs-20">Anda Telah Keluar</h4>
              <p className="text-muted mb-4">Sesi Anda di <strong>{schoolName}</strong> telah berakhir dengan aman.</p>
              
              <div className="mb-4 text-start">
                <div className="bg-light p-3 rounded fst-italic border-start border-4 border-primary" role="alert">
                  <p className="mb-0 text-dark small">
                    Terima kasih telah menggunakan layanan kami. Untuk keamanan, pastikan Anda menutup browser jika menggunakan perangkat publik.
                  </p>
                </div>
              </div>

              <div className="d-grid">
                <Link href="/auth/login" className="btn btn-primary fw-bold py-2 rounded-pill">
                  Masuk Kembali
                </Link>
              </div>
              
              <p className="text-muted fs-14 mt-4 mb-0">
                Butuh bantuan? <Link href="/" className="text-primary fw-semibold">Hubungi IT Support</Link>
              </p>
            </Card>
            <p className="mt-4 text-center text-muted mb-0 small">
              {currentYear} © {schoolName} - Sistem Informasi Akademik
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

// Simple Icon component since I'm using IconifyIcon in the string
import IconifyIcon from '@/components/wrappers/IconifyIcon';

export default LogoutPage;
