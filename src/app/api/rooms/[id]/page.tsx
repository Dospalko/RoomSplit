export default function RoomDetail({ params }: { params: { id: string } }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5">
      <div className="font-semibold mb-2">Room #{params.id}</div>
      <p className="text-sm text-neutral-500">Members & bills UI coming next.</p>
    </div>
  );
}
