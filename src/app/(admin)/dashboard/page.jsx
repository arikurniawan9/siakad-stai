import PageTitle from '@/components/PageTitle';
import { Row, Col, Card, CardBody } from 'react-bootstrap';
import { createClient } from '@/utils/supabase/server';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const DashboardPage = async () => {
  const supabase = await createClient();

  // Ambil data ringkasan untuk dashboard
  const { count: mhsCount } = await supabase.from('mahasiswa').select('*', { count: 'exact', head: true });
  const { count: dosenCount } = await supabase.from('dosen').select('*', { count: 'exact', head: true });
  const { count: prodiCount } = await supabase.from('program_studi').select('*', { count: 'exact', head: true });

  const stats = [
    { label: 'Total Mahasiswa', value: mhsCount || 0, icon: 'ri:group-line', color: 'primary' },
    { label: 'Total Dosen', value: dosenCount || 0, icon: 'ri:teacher-line', color: 'success' },
    { label: 'Program Studi', value: prodiCount || 0, icon: 'ri:book-open-line', color: 'info' },
    { label: 'Tahun Ajaran Aktif', value: '2023/2024 Ganjil', icon: 'ri:calendar-event-line', color: 'warning' },
  ];

  return (
    <>
      <PageTitle title="Dashboard Akademik" subTitle="SIAKAD" />
      
      <Row>
        {stats.map((stat, idx) => (
          <Col md={6} xl={3} key={idx}>
            <Card className="mb-4">
              <CardBody>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <p className="text-muted fw-semibold mb-1">{stat.label}</p>
                    <h3 className="mb-0">{stat.value}</h3>
                  </div>
                  <div className={`avatar-md bg-${stat.color}-subtle rounded-circle d-flex align-items-center justify-content-center`}>
                    <IconifyIcon icon={stat.icon} className={`fs-24 text-${stat.color}`} />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col lg={8}>
          <Card>
            <CardBody>
              <h4 className="header-title mb-4">Selamat Datang di SIAKAD</h4>
              <p className="text-muted">
                Halo Admin! Saat ini sistem sedang dalam pengembangan. Anda dapat mengelola data mahasiswa melalui menu <strong>Akademik {'>'} Mahasiswa</strong> di sidebar.
              </p>
              <div className="alert alert-info border-0 mb-0">
                <IconifyIcon icon="ri:information-line" className="me-1" />
                Pastikan Anda sudah mengatur <strong>Nama Kampus</strong> di halaman Pengaturan.
              </div>
            </CardBody>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card>
            <CardBody>
              <h4 className="header-title mb-3">Aktivitas Terakhir</h4>
              <div className="text-center py-4 text-muted">
                <IconifyIcon icon="ri:history-line" className="fs-32 mb-2" />
                <p className="mb-0">Belum ada aktivitas baru</p>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
