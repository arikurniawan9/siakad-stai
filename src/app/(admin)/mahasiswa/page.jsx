import { Suspense } from 'react';
import PageTitle from '@/components/PageTitle';
import { Row, Col } from 'react-bootstrap';
import MahasiswaList from './components/MahasiswaList';
import { getMahasiswa } from '@/services/mahasiswa';
import FallbackLoading from '@/components/FallbackLoading';

export const metadata = {
  title: 'Master Mahasiswa - SIAKAD'
};

const MahasiswaPage = async ({ searchParams }) => {
  const params = await searchParams;
  const search = params.search || '';
  const page = parseInt(params.page || '1');

  // Fetch data from Supabase via Service
  const { data, count, totalPages } = await getMahasiswa({ search, page });

  return (
    <>
      <PageTitle title="Master Mahasiswa" subTitle="Akademik" />
      <Row>
        <Col xs={12}>
          <Suspense fallback={<FallbackLoading />}>
            <MahasiswaList 
              data={data} 
              count={count} 
              totalPages={totalPages} 
            />
          </Suspense>
        </Col>
      </Row>
    </>
  );
};

export default MahasiswaPage;
