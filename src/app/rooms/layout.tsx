import SimpleHeader from '@/components/SimpleHeader';

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SimpleHeader />
      <main className="relative mx-auto max-w-7xl px-4 lg:px-8 py-8 pt-24">
        {children}
      </main>
    </>
  );
}
