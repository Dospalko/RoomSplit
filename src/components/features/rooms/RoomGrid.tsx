import Link from "next/link";

type OwnedRoom = { id: number; name: string; type: 'owned' };
type MemberRoom = { id: number; name: string; type: 'member'; ownerName: string };

interface RoomCardProps {
  room: OwnedRoom | MemberRoom;
  onDeleteRoom: (id: number) => void;
  isOwner: boolean;
}

function RoomCard({ room, onDeleteRoom, isOwner }: RoomCardProps) {
  return (
    <div className="group relative transform perspective-1000">
      {/* Simplified Glassmorphic Card */}
      <div className="relative backdrop-blur-xl bg-gradient-to-br from-white/95 to-slate-50/95 dark:from-slate-900/95 dark:to-slate-800/95 border border-white/50 dark:border-slate-700/50 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.1)] hover:shadow-[0_30px_100px_rgba(0,0,0,0.15)] transition-all duration-500 overflow-hidden group-hover:scale-[1.02] group-hover:-translate-y-1">
        
        {/* Interactive Link Area */}
        <Link href={`/rooms/${room.id}`} className="absolute inset-0 z-10" aria-label={`Enter ${room.name} room`}></Link>
        
        <div className="relative p-8 z-20">
          {/* Clean Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
              <div className="relative">
                {/* Simplified Avatar */}
                <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg ${
                  isOwner 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                    : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                }`}>
                  <span className="font-mono tracking-wider">{room.name.slice(0,2).toUpperCase()}</span>
                </div>
                
                {/* Simple Role Badge */}
                <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                  isOwner
                    ? 'bg-gradient-to-br from-amber-400 to-amber-500'
                    : 'bg-gradient-to-br from-slate-400 to-slate-500'
                }`}>
                  {isOwner ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold tracking-tight mb-2 text-slate-900 dark:text-slate-100 break-words">
                  {room.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    isOwner 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${isOwner ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                    {isOwner ? 'Owner' : 'Member'}
                  </div>
                  {!isOwner && room.type === 'member' && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      by {(room as MemberRoom).ownerName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Absolute Positioned Delete Button */}
          {isOwner && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDeleteRoom(room.id); }}
              className="absolute top-6 right-6 z-40 group/delete w-12 h-12 rounded-xl backdrop-blur-xl bg-gradient-to-br from-white/20 to-white/5 border border-white/30 text-slate-600 dark:text-slate-300 hover:text-white hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 hover:border-red-400 active:scale-90 transition-all duration-300 flex items-center justify-center hover:scale-110 hover:-rotate-12 shadow-lg hover:shadow-red-500/30"
              title="Delete room"
            >
              <svg className="w-5 h-5 transition-all duration-300 group-hover/delete:scale-110 group-active/delete:scale-95" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}          {/* Premium Status Indicators */}
          <div className="space-y-5 mb-10">
            <div className="flex items-center justify-between p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-500">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wide">ROLE</span>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm backdrop-blur-sm ${
                isOwner
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                  : 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${isOwner ? 'bg-amber-500' : 'bg-blue-500'} animate-pulse`}></div>
                {isOwner ? 'Owner' : 'Member'}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-5 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all duration-500">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-300 tracking-wide">STATUS</span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-sm border border-emerald-500/30 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                ACTIVE
              </div>
            </div>
          </div>
          
          {/* Call-to-Action with Premium Design */}
          <div className="relative z-30">
            <button 
              onClick={(e) => { e.preventDefault(); window.location.href = `/rooms/${room.id}`; }}
              className="group/cta relative w-full overflow-hidden rounded-2xl border border-white/30 backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 p-5 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-400/50 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <div className="relative flex items-center justify-center gap-3 text-slate-700 dark:text-slate-200 group-hover/cta:text-blue-700 dark:group-hover/cta:text-blue-300 transition-colors duration-300">
                <svg className="w-6 h-6 group-hover/cta:scale-125 group-hover/cta:rotate-12 group-active/cta:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-bold tracking-wide text-lg group-hover/cta:scale-105 transition-transform duration-300">ENTER ROOM</span>
                <div className="w-3 h-3 rounded-full bg-current animate-pulse group-hover/cta:scale-125 group-active/cta:scale-110 transition-transform duration-300"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Remove floating particles */}
      </div>
    </div>
  );
}

interface RoomGridProps {
  ownedRooms: OwnedRoom[];
  memberRooms: MemberRoom[];
  onDeleteRoom: (id: number) => void;
  onCreateRoom: () => void;
  creating: boolean;
}

export default function RoomGrid({ ownedRooms, memberRooms, onDeleteRoom, onCreateRoom, creating }: RoomGridProps) {
  const totalRooms = ownedRooms.length + memberRooms.length;

  if (totalRooms === 0) {
    return (
      <section id="rooms" className="relative py-20 overflow-hidden">
        {/* Premium background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative text-center mb-12">
          <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 border border-white/20 dark:border-slate-700/50 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 mb-8 backdrop-blur-xl shadow-2xl shadow-black/5 hover:shadow-black/10 transition-all duration-300 hover:scale-105">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse"></div>
            <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-black uppercase tracking-wide">
              Your Rooms
            </span>
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[0.9]">
            <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent drop-shadow-2xl">
              Start your first
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
              room
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto font-light mb-12">
            Create your first room to start splitting expenses with your <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">roommates, friends, or travel group</span>
          </p>
        </div>
        
        {/* Premium empty state card */}
        <div className="max-w-2xl mx-auto">
          <div className="group relative transform hover:-translate-y-2 transition-all duration-700">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 scale-110"></div>
            
            {/* Main card */}
            <div className="relative rounded-3xl border-2 border-dashed border-slate-300/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-16 text-center shadow-[0_20px_70px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_120px_rgba(0,0,0,0.2)] transition-all duration-700 overflow-hidden">
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3)_0%,transparent_50%)]"></div>
              </div>
              
              {/* Icon with enhanced design */}
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white mx-auto shadow-2xl shadow-blue-500/30 group-hover:shadow-3xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                  <svg className="w-12 h-12 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m4 0L9 9h10v12M9 9V5m5 12h2m-7 0v4" />
                  </svg>
                </div>
                
                {/* Floating decorative elements */}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-xl opacity-80 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow-xl opacity-80 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500"></div>
              </div>
              
              {/* Content */}
              <div className="relative">
                <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                  Ready to split?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-roboto-mono mb-8">
                  Create your first room and experience the most elegant way to manage shared expenses
                </p>
                
                {/* Premium CTA button */}
                <button 
                  onClick={onCreateRoom} 
                  className="group/btn relative inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-10 py-5 text-xl font-bold shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:shadow-[0_0_80px_rgba(59,130,246,0.5)] active:scale-95 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-4">
                    <svg className="w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="font-space-mono">Create First Room</span>
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  </div>
                  <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 skew-x-12"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="rooms" className="relative py-20 overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Enhanced header section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-20 gap-6 max-w-8xl mx-auto px-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-white/90 to-slate-50/90 dark:from-slate-800/90 dark:to-slate-900/90 border border-white/20 dark:border-slate-700/50 px-6 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 mb-6 backdrop-blur-xl shadow-2xl shadow-black/5">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"></div>
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent font-black uppercase tracking-wide">
                {totalRooms} Active Room{totalRooms !== 1 ? 's' : ''}
              </span>
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-[0.9]">
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-100 dark:to-white bg-clip-text text-transparent drop-shadow-2xl">
                Your rooms
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              Manage your <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">shared expense groups</span>
            </p>
          </div>
          
          {!creating && (
            <button 
              onClick={onCreateRoom} 
              className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-4 text-lg font-bold shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:shadow-[0_0_80px_rgba(59,130,246,0.5)] active:scale-95 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="font-space-mono">New Room</span>
              </div>
              <div className="absolute inset-0 bg-white/20 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500 skew-x-12"></div>
            </button>
          )}
        </div>
        
        {/* Room sections */}
        <div className="w-full px-4 lg:px-8 space-y-24">
          {/* Owned Rooms Section */}
          {ownedRooms.length > 0 && (
            <div className="relative">
              {/* Epic Section Header */}
              <div className="relative mb-12 group">
                {/* Background Glow */}
                <div className="absolute -inset-8 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 rounded-3xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>
                
                {/* Header Container */}
                <div className="relative backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/20 rounded-3xl p-8 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)]">
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 rounded-3xl"></div>
                    <div className="absolute -right-8 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 blur-2xl animate-pulse"></div>
                    <div className="absolute -left-6 -bottom-2 w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400/20 to-amber-500/20 blur-xl animate-pulse delay-1000"></div>
                  </div>

                  <div className="relative flex items-center gap-6">
                    {/* Crown Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center shadow-[0_20px_40px_rgba(251,146,60,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                      <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                        Your Rooms
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">
                        Rooms you created and manage • {ownedRooms.length} room{ownedRooms.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Floating Stats Badge */}
                    <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 shadow-lg">
                      <div className="text-3xl font-black text-amber-700 dark:text-amber-300">
                        {ownedRooms.length}
                      </div>
                      <div className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                        OWNED
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-12 lg:gap-16">
                {ownedRooms.map((r) => (
                  <RoomCard key={r.id} room={r} onDeleteRoom={onDeleteRoom} isOwner={true} />
                ))}
              </div>
            </div>
          )}

          {/* Member Rooms Section */}
          {memberRooms.length > 0 && (
            <div className="relative">
              {/* Epic Section Header */}
              <div className="relative mb-12 group">
                {/* Background Glow */}
                <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>
                
                {/* Header Container */}
                <div className="relative backdrop-blur-xl bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/20 rounded-3xl p-8 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.3)]">
                  {/* Animated Background Elements */}
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 via-transparent to-violet-500/10 rounded-3xl"></div>
                    <div className="absolute -right-8 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-blue-400/20 to-violet-500/20 blur-2xl animate-pulse"></div>
                    <div className="absolute -left-6 -bottom-2 w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 blur-xl animate-pulse delay-1000"></div>
                  </div>

                  <div className="relative flex items-center gap-6">
                    {/* Member Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-purple-600 flex items-center justify-center shadow-[0_20px_40px_rgba(99,102,241,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                      <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-4xl font-black tracking-tight mb-2 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Invited Rooms
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">
                        Rooms you&apos;ve been invited to • {memberRooms.length} room{memberRooms.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Floating Stats Badge */}
                    <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-violet-500/20 backdrop-blur-sm border border-blue-500/30 shadow-lg">
                      <div className="text-3xl font-black text-blue-700 dark:text-blue-300">
                        {memberRooms.length}
                      </div>
                      <div className="text-xs font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                        JOINED
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-12 lg:gap-16">
                {memberRooms.map((r) => (
                  <RoomCard key={r.id} room={r} onDeleteRoom={onDeleteRoom} isOwner={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
