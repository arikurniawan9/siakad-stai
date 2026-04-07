'use client';

import avatar3 from '@/assets/images/users/avatar-3.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

const ProfileDropdown = () => {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState({ name: 'User', role: '' });

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nama_lengkap, role')
          .eq('id', user.id)
          .single();
        
        setUser({
          name: profile?.nama_lengkap || user.email.split('@')[0],
          role: profile?.role || ''
        });
      }
    }
    getUser();
  }, [supabase]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/auth/logout');
    router.refresh();
  };

  return (
    <div className="topbar-item nav-user">
      <Dropdown>
        <DropdownToggle as={'a'} className="topbar-link drop-arrow-none px-2" role="button">
          <Image src={avatar3} width={32} className="rounded-circle me-lg-2 d-flex" alt="user-image" />
          <span className="d-lg-flex flex-column gap-1 d-none text-start">
            <span className="fw-semibold lh-1">{user.name}</span>
            <small className="text-muted text-uppercase fs-10">{user.role}</small>
          </span>
          <IconifyIcon icon="ri:arrow-down-s-line" className="d-none d-lg-block align-middle ms-2" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownHeader className="noti-title">
            <h6 className="text-overflow m-0">Selamat Datang !</h6>
          </DropdownHeader>
          
          <DropdownItem onClick={() => router.push('/settings')}>
            <IconifyIcon icon="ri:settings-2-line" className=" me-1 fs-16 align-middle" />
            <span className="align-middle">Pengaturan</span>
          </DropdownItem>
          
          <div className="dropdown-divider" />
          
          <DropdownItem onClick={handleLogout} className="fw-semibold text-danger">
            <IconifyIcon icon="ri:logout-box-line" className="me-1 fs-16 align-middle" />
            <span className="align-middle">Keluar Sistem</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileDropdown;
