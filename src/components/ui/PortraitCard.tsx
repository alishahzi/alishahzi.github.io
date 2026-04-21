import { useState } from 'react';
import { personal } from '../../data/content';

export default function PortraitCard() {
  const [err, setErr] = useState(false);
  return (
    <div style={{
      position:'relative', width:'100%', maxWidth:'300px',
      aspectRatio:'1/1', margin:'0 auto',
    }}>
      {/* Rotating gradient ring */}
      <div style={{
        position:'absolute', inset:'-3px', borderRadius:'50%',
        background:'conic-gradient(from 0deg,#06b6d4,#3b82f6,#8b5cf6,#06b6d4)',
        opacity:0.35, animation:'portrait-spin 10s linear infinite',
      }}/>
      <style>{`@keyframes portrait-spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* Inner glow */}
      <div style={{
        position:'absolute', inset:'2px', borderRadius:'50%',
        boxShadow:'inset 0 0 30px rgba(6,182,212,0.15)',
        border:'1px solid rgba(6,182,212,0.3)', zIndex:1,
      }}/>

      {/* Photo or initials fallback */}
      {personal.image && !err ? (
        <img
          src={personal.image}
          alt={personal.name}
          onError={()=>setErr(true)}
          style={{
            position:'relative', zIndex:2,
            width:'100%', height:'100%',
            borderRadius:'50%',
            objectFit:'cover', objectPosition:'center top',
            display:'block',
          }}
        />
      ):(
        <div style={{
          position:'relative', zIndex:2,
          width:'100%', height:'100%', borderRadius:'50%',
          background:'linear-gradient(135deg,#0a1628,#0d2040)',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'2.5rem', fontWeight:700, color:'#06b6d4',
          letterSpacing:'0.05em',
        }}>
          {personal.initials||'MAA'}
        </div>
      )}
    </div>
  );
}
