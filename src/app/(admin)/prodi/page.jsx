'use client';

import { useState, useEffect } from 'react';
import PageTitle from '@/components/PageTitle';
import { Row, Col, Card, CardHeader, Table, Button, Modal, Form } from 'react-bootstrap';
import { createClient } from '@/utils/supabase/client';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { toast } from 'react-toastify';
import { createProdi, deleteProdi } from './actions';

const ProdiPage = () => {
  const [prodis, setProdis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama_prodi: '', kode_prodi: '', fakultas: '' });
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const fetchProdis = async () => {
    setLoading(true);
    const { data } = await supabase.from('program_studi').select('*').order('nama_prodi');
    if (data) setProdis(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProdis();
  }, [supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createProdi(formData);
      toast.success('Program Studi berhasil ditambahkan');
      setShowModal(false);
      setFormData({ nama_prodi: '', kode_prodi: '', fakultas: '' });
      fetchProdis();
    } catch (error) {
      toast.error('Gagal: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageTitle title="Program Studi" subTitle="Akademik" />
      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
              <h4 className="header-title">Daftar Program Studi</h4>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <IconifyIcon icon="ri:add-line" className="me-1" />
                Tambah Prodi
              </Button>
            </CardHeader>
            <div className="table-responsive">
              <Table className="table-hover mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Kode Prodi</th>
                    <th>Nama Program Studi</th>
                    <th>Fakultas</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="4" className="text-center py-4">Memuat data...</td></tr>
                  ) : prodis.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-4">Belum ada data prodi</td></tr>
                  ) : (
                    prodis.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-bold">{item.kode_prodi}</td>
                        <td>{item.nama_prodi}</td>
                        <td>{item.fakultas}</td>
                        <td className="text-center">
                          <Button variant="soft-danger" size="sm" className="btn-icon rounded-circle" onClick={async () => {
                            if(confirm('Hapus prodi ini?')) {
                              await deleteProdi(item.id);
                              fetchProdis();
                            }
                          }}>
                            <IconifyIcon icon="ri:delete-bin-line" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Program Studi</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Kode Prodi</Form.Label>
              <Form.Control type="text" value={formData.kode_prodi} onChange={(e) => setFormData({...formData, kode_prodi: e.target.value})} placeholder="Misal: IF, SI, TI" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nama Program Studi</Form.Label>
              <Form.Control type="text" value={formData.nama_prodi} onChange={(e) => setFormData({...formData, nama_prodi: e.target.value})} placeholder="Misal: Teknik Informatika" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fakultas</Form.Label>
              <Form.Control type="text" value={formData.fakultas} onChange={(e) => setFormData({...formData, fakultas: e.target.value})} placeholder="Misal: Ilmu Komputer" />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowModal(false)}>Batal</Button>
            <Button variant="primary" type="submit" disabled={submitting}>Simpan</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ProdiPage;
