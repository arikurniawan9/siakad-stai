'use client';

import { useState, useEffect } from 'react';
import PageTitle from '@/components/PageTitle';
import { Row, Col, Card, CardHeader, Table, Button, Modal, Form } from 'react-bootstrap';
import { createClient } from '@/utils/supabase/client';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { toast } from 'react-toastify';
import { createUser, deleteUser } from './actions';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'mahasiswa' });
  const [submitting, setSubmitting] = useState(false);
  const supabase = createClient();

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [supabase]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createUser(formData);
      toast.success('Pengguna berhasil ditambahkan');
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'mahasiswa' });
      fetchUsers();
    } catch (error) {
      toast.error('Gagal menambahkan pengguna: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
      try {
        await deleteUser(id);
        toast.success('Pengguna berhasil dihapus');
        fetchUsers();
      } catch (error) {
        toast.error('Gagal menghapus: ' + error.message);
      }
    }
  };

  const roleBadge = (role) => {
    const colors = { admin: 'danger', bendahara: 'warning', dosen: 'success', mahasiswa: 'primary' };
    return <span className={`badge bg-${colors[role] || 'info'}-subtle text-${colors[role] || 'info'} text-uppercase`}>{role}</span>;
  };

  return (
    <>
      <PageTitle title="Manajemen Pengguna" subTitle="Admin" />
      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
              <h4 className="header-title">Daftar Akun Pengguna</h4>
              <Button variant="primary" onClick={() => setShowModal(true)}>
                <IconifyIcon icon="ri:user-add-line" className="me-1" />
                Tambah Pengguna
              </Button>
            </CardHeader>
            <div className="table-responsive">
              <Table className="table-hover mb-0">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Nama Lengkap</th>
                    <th>Email</th>
                    <th>Role / Peran</th>
                    <th>Terdaftar Pada</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-4">Memuat data...</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4">Belum ada pengguna terdaftar</td></tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="fw-semibold">{user.nama_lengkap}</td>
                        <td>{user.email}</td>
                        <td>{roleBadge(user.role)}</td>
                        <td>{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                        <td className="text-center">
                          <Button variant="soft-danger" size="sm" className="btn-icon rounded-circle" onClick={() => handleDelete(user.id)}>
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
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title>Tambah Pengguna Baru</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddUser}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Masukkan nama" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@kampus.ac.id" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password Sementara</Form.Label>
              <Form.Control type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Min. 6 karakter" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role / Peran</Form.Label>
              <Form.Select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="admin">Admin / Operator</option>
                <option value="bendahara">Bendahara</option>
                <option value="dosen">Dosen</option>
                <option value="mahasiswa">Mahasiswa</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="border-top">
            <Button variant="light" onClick={() => setShowModal(false)}>Batal</Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Menyimpan...' : 'Tambah Pengguna'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagementPage;
