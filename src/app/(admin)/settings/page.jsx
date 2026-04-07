'use client';

import { useState, useEffect } from 'react';
import PageTitle from '@/components/PageTitle';
import { Row, Col, Card, CardHeader, CardBody, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { updateSchoolName, updateSchoolLogo } from './actions';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

const SettingsPage = () => {
  const [schoolName, setSchoolName] = useState('');
  const [schoolLogo, setSchoolLogo] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) {
        setSchoolName(data.school_name || '');
        setSchoolLogo(data.school_logo_url || '/Wikimedia-logo.png');
      }
      setLoading(false);
    }
    loadSettings();
  }, [supabase]);

  const handleSaveName = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateSchoolName(schoolName);
      toast.success('Nama Kampus berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveLogo = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateSchoolLogo(schoolLogo);
      toast.success('Logo Kampus berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal memperbarui: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Memuat...</div>;

  return (
    <>
      <PageTitle title="Pengaturan Global" subTitle="Admin" />
      <Row>
        <Col lg={6}>
          <Card className="mb-4">
            <CardHeader className="border-bottom">
              <h4 className="header-title">Identitas Kampus</h4>
            </CardHeader>
            <CardBody>
              <Form onSubmit={handleSaveName}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Kampus</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={schoolName} 
                    onChange={(e) => setSchoolName(e.target.value)} 
                    placeholder="Masukkan nama kampus..."
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={updating}>
                  Simpan Nama
                </Button>
              </Form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="border-bottom">
              <h4 className="header-title">Logo Kampus</h4>
            </CardHeader>
            <CardBody>
              <div className="mb-3 text-center">
                <div className="avatar-xl mx-auto mb-3 bg-light p-2 rounded">
                  <Image 
                    src={schoolLogo} 
                    alt="Preview Logo" 
                    width={100} 
                    height={100} 
                    className="img-fluid object-fit-contain"
                    unoptimized // if using external URLs
                  />
                </div>
              </div>
              <Form onSubmit={handleSaveLogo}>
                <Form.Group className="mb-3">
                  <Form.Label>URL Logo (atau path di folder public)</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={schoolLogo} 
                    onChange={(e) => setSchoolLogo(e.target.value)} 
                    placeholder="/Wikimedia-logo.png"
                    required
                  />
                  <Form.Text className="text-muted">
                    Contoh: <code>/Wikimedia-logo.png</code> atau URL lengkap <code>https://...</code>
                  </Form.Text>
                </Form.Group>
                <Button variant="success" type="submit" disabled={updating}>
                  Simpan Logo
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SettingsPage;
