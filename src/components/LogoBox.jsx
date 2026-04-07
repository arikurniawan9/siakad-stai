'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

const LogoBox = () => {
  const [settings, setSettings] = useState({
    school_name: 'SIAKAD',
    school_logo_url: '/Wikimedia-logo.png'
  });
  const supabase = createClient();

  useEffect(() => {
    async function fetchSettings() {
      const { data, error } = await supabase
        .from('settings')
        .select('school_name, school_logo_url')
        .single();
      
      if (data && !error) {
        setSettings({
          school_name: data.school_name || 'SIAKAD',
          school_logo_url: data.school_logo_url || '/Wikimedia-logo.png'
        });
      }
    }
    fetchSettings();
  }, [supabase]);

  return (
    <Link href="/" className="logo">
      <div className="d-flex align-items-center gap-2 py-3 px-2">
        <Image 
          width={40} 
          height={40} 
          src={settings.school_logo_url} 
          alt="logo" 
          className="img-fluid object-fit-contain"
          unoptimized
        />
        <div className="logo-text d-none d-lg-block">
          <h5 className="mb-0 text-white text-truncate fw-bold" style={{ maxWidth: '150px' }}>
            {settings.school_name}
          </h5>
        </div>
      </div>
    </Link>
  );
};

export default LogoBox;
