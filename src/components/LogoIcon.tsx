const LogoIcon = () => {
  return (
    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-red-800 shadow-lg">
      {/* Glowing gold pulse */}
      <div className="absolute inset-0 rounded-full bg-gold/40 blur-md animate-pulse scale-110 z-0" />
      
      {/* 福 character */}
      <span className="relative z-10 text-2xl font-bold text-gold drop-shadow-lg">福</span>
    </div>
  );
};

export default LogoIcon;
