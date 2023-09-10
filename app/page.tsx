'use client';

import { login } from './script.tsx';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  useEffect(() => {
    login();
  });
  return (
    <>
      <header className="flex items-center justify-end">
        <div className="flex items-center justify-between bg-zinc-800 p-1">
          <Image
            width={40}
            height={40}
            className="rounded-md"
            alt="profile-img"
            src="/res/icons/steve.png"
          />
          <Link className="ml-3" href="/login">
            Войти
          </Link>
        </div>
      </header>
    </>
  );
}
