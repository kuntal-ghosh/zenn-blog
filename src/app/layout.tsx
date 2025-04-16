import React, { JSX } from 'react';
import  Header  from '@/shared/components/layout/Header';
import  Footer  from '../shared/components/layout/Footer';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;