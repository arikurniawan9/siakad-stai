'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Table, Button, Card, CardHeader, CardFooter, Form } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
import { bulkDeleteMahasiswa } from '../actions';

const MahasiswaList = ({ data, count, totalPages }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const searchQuery = searchParams.get('search') || '';

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

  const handleDeleteSelected = async () => {
    if (window.confirm(`Hapus ${selectedIds.length} data terpilih?`)) {
      setIsDeleting(true);
      try {
        await bulkDeleteMahasiswa(selectedIds);
        toast.success('Data berhasil dihapus');
        setSelectedIds([]);
        router.refresh();
      } catch (error) {
        toast.error('Gagal menghapus data: ' + error.message);
      } finally {
        setIsDeleting(false);
      }
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

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws);
        
        console.log('Data yang akan di-import:', jsonData);
        toast.info(`Memproses ${jsonData.length} data...`);
        // Di sini panggil service importMahasiswa(jsonData)
        toast.success('Import berhasil (Simulasi)');
        router.refresh();
      } catch (err) {
        toast.error('Gagal membaca file Excel: ' + err.message);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (val) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page on search
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader className="border-bottom d-flex flex-wrap align-items-center gap-2">
        <div className="flex-grow-1">
          <h4 className="header-title">Daftar Mahasiswa ({count})</h4>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <div className="position-relative">
            <input 
              type="text" 
              className="form-control ps-4" 
              placeholder="Cari NIM atau Nama..." 
              defaultValue={searchQuery}
              onChange={(e) => {
                // simple debounce could be added here
                handleSearch(e);
              }}
            />
            <IconifyIcon icon="ti:search" className="position-absolute top-50 translate-middle-y start-0 ms-2" />
          </div>
          
          {selectedIds.length > 0 && (
            <Button variant="danger" onClick={handleDeleteSelected} disabled={isDeleting}>
              <IconifyIcon icon="ri:delete-bin-line" className="me-1" />
              Hapus Terpilih ({selectedIds.length})
            </Button>
          )}

          <Button variant="success" onClick={handleExport}>
            <IconifyIcon icon="ri:file-excel-line" className="me-1" />
            Export Excel
          </Button>

          <Button variant="info" as="label" htmlFor="import-excel" style={{ cursor: 'pointer' }}>
            <IconifyIcon icon="ri:upload-2-line" className="me-1" />
            Import Excel
            <input 
              type="file" 
              id="import-excel" 
              hidden 
              accept=".xlsx, .xls"
              onChange={handleImport}
            />
          </Button>
          
          <Button variant="primary">
            <IconifyIcon icon="ri:add-line" className="me-1" />
            Tambah Mahasiswa
          </Button>
        </div>
      </CardHeader>

      <div className="table-responsive">
        <Table className="table-hover text-nowrap mb-0">
          <thead className="bg-light-subtle">
            <tr>
              <th className="ps-3" style={{ width: 50 }}>
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  onChange={handleSelectAll}
                  checked={selectedIds.length === data.length && data.length > 0}
                />
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
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">Data tidak ditemukan</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  <td className="ps-3">
                    <input 
                      type="checkbox" 
                      className="form-check-input" 
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleSelectOne(item.id)}
                    />
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
                    <div className="hstack gap-1 justify-content-center">
                      <Button variant="soft-primary" size="sm" className="btn-icon rounded-circle">
                        <IconifyIcon icon="ri:edit-box-line" />
                      </Button>
                      <Button variant="soft-danger" size="sm" className="btn-icon rounded-circle" onClick={() => {
                        if(confirm('Hapus data ini?')) {
                          // call delete service
                        }
                      }}>
                        <IconifyIcon icon="ri:delete-bin-line" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <CardFooter className="d-flex justify-content-between align-items-center">
        <div className="text-muted small">
          Menampilkan {(currentPage - 1) * 10 + 1} sampai {Math.min(currentPage * 10, count)} dari {count} data
        </div>
        <div className="d-flex gap-1">
          <Button 
            variant="light" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button 
              key={i} 
              variant={currentPage === i + 1 ? 'primary' : 'light'} 
              size="sm"
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button 
            variant="light" 
            size="sm" 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MahasiswaList;
