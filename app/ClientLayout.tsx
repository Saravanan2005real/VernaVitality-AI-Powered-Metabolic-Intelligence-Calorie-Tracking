'use client';

import Footer from './components/Footer';
import Navigation from './components/Navigation';

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navigation />
      <div className="flex-grow overflow-hidden">{children}</div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutInner>{children}</RootLayoutInner>;
}
