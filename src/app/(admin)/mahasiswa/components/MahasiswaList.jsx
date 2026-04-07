'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Table, Button, Card, CardHeader, CardFooter, Modal, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { bulkDeleteMahasiswa, createMahasiswa } from '../actions';
import { createClient } from '@/utils/supabase/client';

const MahasiswaList = ({ data, count, totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State untuk Tambah Mahasiswa
  const [showModal, setShowModal] = useState(false);
  const [prodis, setProdis] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [formData, setFormData] = useState({ id: '', nim: '', prodi_id: '', angkatan: new Date().getFullYear(), status_aktif: true });
  const [submitting, setSubmitting] = useState(false);
  
  const supabase = createClient();
  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchQuery = searchParams.get('search') || '';

  // Load Program Studi & Users yang belum jadi mahasiswa
  const loadOptions = async () => {
    const { data: prodiData } = await supabase.from('program_studi').select('id, nama_prodi');
    if (prodiData) setProdis(prodiData);

    // Ambil users dengan role mahasiswa yang BELUM ada di tabel mahasiswa
    const { data: userData } = await supabase
      .from('profiles')
      .select('id, nama_lengkap')
      .eq('role', 'mahasiswa');
    
    if (userData) setAvailableUsers(userData);
  };

  useEffect(() => {
    if (showModal) loadOptions();
  }, [showModal]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(data.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddMahasiswa = async (e) => {
    e.preventDefault();
    if (!formData.id || !formData.prodi_id) {
      toast.error('Mohon pilih User dan Program Studi');
      return;
    }
    setSubmitting(true);
    try {
      await createMahasiswa(formData);
      toast.success('Mahasiswa berhasil ditambahkan');
      setShowModal(false);
      setFormData({ id: '', nim: '', prodi_id: '', angkatan: new Date().getFullYear(), status_aktif: true });
      router.refresh();
    } catch (error) {
      toast.error('Gagal: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = () => {
    const exportData = data.map(item => ({
      NIM: item.nim,
      Nama: item.profiles?.nama_lengkap,
      Prodi: item.program_studi?.nama_prodi,
      Angkatan: item.angkatan,
      Status: item.status_aktif ? 'Aktif' : 'Non-Aktif'
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mahasiswa");
    XLSX.writeFile(wb, "Data_Mahasiswa.xlsx");
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (val) params.set('search', val); else params.delete('search');
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <Card>
        <CardHeader className="border-bottom d-flex flex-wrap align-items-center gap-2">
          <div className="flex-grow-1">
            <h4 className="header-title">Daftar Mahasiswa ({count})</h4>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <div className="position-relative">
              <input type="text" className="form-control ps-4" placeholder="Cari NIM atau Nama..." defaultValue={searchQuery} onChange={handleSearch} />
              <IconifyIcon icon="ti:search" className="position-absolute top-50 translate-middle-y start-0 ms-2" />
            </div>
            
            {selectedIds.length > 0 && (
              <Button variant="danger" onClick={async () => {
                if(confirm(`Hapus ${selectedIds.length} data?`)) {
                  await bulkDeleteMahasiswa(selectedIds);
                  setSelectedIds([]);
                  router.refresh();
                }
              }}>
                Hapus Terpilih ({selectedIds.length})
              </Button>
            )}

            <Button variant="success" onClick={handleExport}>
              <IconifyIcon icon="ri:file-excel-line" className="me-1" /> Export
            </Button>
            
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <IconifyIcon icon="ri:add-line" className="me-1" /> Tambah Mahasiswa
            </Button>
          </div>
        </CardHeader>

        <div className="table-responsive">
          <Table className="table-hover text-nowrap mb-0">
            <thead className="bg-light-subtle">
              <tr>
                <th className="ps-3" style={{ width: 50 }}>
                  <input type="checkbox" className="form-check-input" onChange={handleSelectAll} checked={selectedIds.length === data.length && data.length > 0} />
                </th>
                <th>NIM</th>
                <th>Nama Lengkap</th>
                <th>Program Studi</th>
                <th>Angkatan</th>
                <th>Status</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">Data tidak ditemukan</td></tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id}>
                    <td className="ps-3">
                      <input type="checkbox" className="form-check-input" checked={selectedIds.includes(item.id)} onChange={() => handleSelectOne(item.id)} />
                    </td>
                    <td><span className="fw-semibold">{item.nim}</span></td>
                    <td>{item.profiles?.nama_lengkap}</td>
                    <td>{item.program_studi?.nama_prodi}</td>
                    <td>{item.angkatan}</td>
                    <td>
                      <span className={`badge bg-${item.status_aktif ? 'success' : 'danger'}-subtle text-${item.status_aktif ? 'success' : 'danger'}`}>
                        {item.status_aktif ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className="text-center">
                      <Button variant="soft-danger" size="sm" className="btn-icon rounded-circle" onClick={async () => {
                        if(confirm('Hapus data ini?')) {
                          await bulkDeleteMahasiswa([item.id]);
                          router.refresh();
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

        <CardFooter className="d-flex justify-content-between align-items-center">
          <div className="text-muted small">Menampilkan {(currentPage - 1) * 10 + 1} sampai {Math.min(currentPage * 10, count)} dari {count} data</div>
          <div className="d-flex gap-1">
            <Button variant="light" size="sm" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Prev</Button>
            <Button variant="light" size="sm" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</Button>
          </div>
        </CardFooter>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Data Mahasiswa</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddMahasiswa}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Pilih Akun Pengguna</Form.Label>
              <Form.Select value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} required>
                <option value="">-- Pilih User --</option>
                {availableUsers.map(u => <option key={u.id} value={u.id}>{u.nama_lengkap}</option>)}
              </Form.Select>
              <Form.Text className="text-muted text-xs">Hanya menampilkan user dengan role 'mahasiswa'</Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>NIM</Form.Label>
              <Form.Control type="text" value={formData.nim} onChange={(e) => setFormData({...formData, nim: e.target.value})} placeholder="Masukkan NIM" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Program Studi</Form.Label>
              <Form.Select value={formData.prodi_id} onChange={(e) => setFormData({...formData, prodi_id: e.target.value})} required>
                <option value="">-- Pilih Prodi --</option>
                {prodis.map(p => <option key={p.id} value={p.id}>{p.nama_prodi}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Angkatan</Form.Label>
              <Form.Control type="number" value={formData.angkatan} onChange={(e) => setFormData({...formData, angkatan: e.target.value})} required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowModal(false)}>Batal</Button>
            <Button variant="primary" type="submit" disabled={submitting}>Simpan Data</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default MahasiswaList;
