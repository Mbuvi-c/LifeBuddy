import { useState } from 'react'
import type { LearnModule } from './learnData_money'

interface LearnModuleProps {
  module: LearnModule
  onComplete: () => void
  imageBasePath?: string
}

const MONEY_ITEMS = [
  { src: '/images/learn/coin_1.jpg',    size: 60,  type: 'coin' },
  { src: '/images/learn/coin_5.jpg',    size: 70,  type: 'coin' },
  { src: '/images/learn/coin_10.jpg',   size: 75,  type: 'coin' },
  { src: '/images/learn/coin_20.jpg',   size: 80,  type: 'coin' },
  { src: '/images/learn/coin_40.jpg',   size: 65,  type: 'coin' },
  { src: '/images/learn/note_50.jpg',   size: 120, type: 'note' },
  { src: '/images/learn/note_100.jpg',  size: 120, type: 'note' },
  { src: '/images/learn/note_200.jpg',  size: 130, type: 'note' },
  { src: '/images/learn/note_500.png',  size: 125, type: 'note' },
  { src: '/images/learn/note_1000.jpg', size: 130, type: 'note' },
]

function FloatingMoney() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <style>{`
        @keyframes floatUp0 { 0% { transform: translateY(60%) rotate(0deg); opacity: 0.6; } 100% { transform: translateY(-110%) rotate(20deg); opacity: 0; } }
        @keyframes floatUp1 { 0% { transform: translateY(80%) rotate(-10deg); opacity: 0.5; } 100% { transform: translateY(-110%) rotate(5deg); opacity: 0; } }
        @keyframes floatUp2 { 0% { transform: translateY(40%) rotate(15deg); opacity: 0.7; } 100% { transform: translateY(-110%) rotate(-10deg); opacity: 0; } }
        @keyframes floatUp3 { 0% { transform: translateY(90%) rotate(-5deg); opacity: 0.5; } 100% { transform: translateY(-110%) rotate(12deg); opacity: 0; } }
        @keyframes floatUp4 { 0% { transform: translateY(20%) rotate(8deg); opacity: 0.6; } 100% { transform: translateY(-110%) rotate(-8deg); opacity: 0; } }
        @keyframes floatUp5 { 0% { transform: translateY(70%) rotate(-12deg); opacity: 0.5; } 100% { transform: translateY(-110%) rotate(3deg); opacity: 0; } }
        @keyframes floatUp6 { 0% { transform: translateY(30%) rotate(6deg); opacity: 0.7; } 100% { transform: translateY(-110%) rotate(-15deg); opacity: 0; } }
        @keyframes floatUp7 { 0% { transform: translateY(50%) rotate(-8deg); opacity: 0.4; } 100% { transform: translateY(-110%) rotate(10deg); opacity: 0; } }
        @keyframes floatUp8 { 0% { transform: translateY(10%) rotate(3deg); opacity: 0.6; } 100% { transform: translateY(-110%) rotate(-6deg); opacity: 0; } }
        @keyframes floatUp9 { 0% { transform: translateY(75%) rotate(-3deg); opacity: 0.5; } 100% { transform: translateY(-110%) rotate(8deg); opacity: 0; } }
      `}</style>
      {MONEY_ITEMS.map((item, i) => (
        <img
          key={i}
          src={item.src}
          alt=""
          style={{
            position: 'absolute',
            left: `${5 + (i * 10) % 75}%`,
            top: '0%',
            width: item.size,
            height: item.type === 'coin' ? item.size : 'auto',
            borderRadius: item.type === 'coin' ? '50%' : '4px',
            objectFit: 'cover',
            animation: `floatUp${i} ${8 + (i * 1.1)}s ease-in-out ${-(i * 0.9)}s infinite`,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
            pointerEvents: 'none',
          }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      ))}
    </div>
  )
}

export default function LearnModule({ module, onComplete, imageBasePath = '/images/learn/' }: LearnModuleProps) {
  const [slideIndex, setSlideIndex] = useState(0)
  const [subIndex, setSubIndex] = useState(0)

  const currentSlide = module.slides[slideIndex]
  const currentSub = currentSlide.subSlides[subIndex]
  const isLastSub = subIndex === currentSlide.subSlides.length - 1
  const isLastSlide = slideIndex === module.slides.length - 1
  const isLastOfAll = isLastSlide && isLastSub

  const totalSubSlides = module.slides.reduce((acc, s) => acc + s.subSlides.length, 0)
  const completedSubSlides = module.slides
    .slice(0, slideIndex)
    .reduce((acc, s) => acc + s.subSlides.length, 0) + subIndex

  const progressPct = Math.round((completedSubSlides / totalSubSlides) * 100)

  function handleNext() {
    if (!isLastSub) {
      setSubIndex(subIndex + 1)
      return
    }
    if (!isLastSlide) {
      setSlideIndex(slideIndex + 1)
      setSubIndex(0)
      return
    }
    onComplete()
  }

  function handleBack() {
    if (subIndex > 0) {
      setSubIndex(subIndex - 1)
      return
    }
    if (slideIndex > 0) {
      const prevSlide = module.slides[slideIndex - 1]
      setSlideIndex(slideIndex - 1)
      setSubIndex(prevSlide.subSlides.length - 1)
    }
  }

  const isFirst = slideIndex === 0 && subIndex === 0

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      background: 'var(--bg, #0e0f1a)',
      fontFamily: 'var(--font-display, sans-serif)',
      overflow: 'hidden',
    }}>

      {/* Progress bar */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', flexShrink: 0 }}>
        <div style={{
          height: '100%',
          width: `${progressPct}%`,
          background: '#7c6ffa',
          borderRadius: 2,
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        <button
          onClick={onComplete}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9da3b8', fontSize: 20, padding: 4, lineHeight: 1,
          }}>←</button>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f1f5' }}>
          {module.title}
        </div>
        <div style={{ fontSize: 12, color: '#6b7290' }}>
          {completedSubSlides + 1} / {totalSubSlides}
        </div>
      </div>

      {/* Main content — two columns */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
      }}>

        {/* Left — text and button */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px 32px 36px',
          minWidth: 0,
          position: 'relative',
          overflow: 'hidden',
        }}>

          {/* Animated blob background */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <style>{`
              @keyframes blob1 { 0%, 100% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(50px, -35px) scale(1.15); } 66% { transform: translate(-30px, 25px) scale(0.92); } }
              @keyframes blob2 { 0%, 100% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(-40px, 35px) scale(1.1); } 66% { transform: translate(35px, -20px) scale(1.15); } }
              @keyframes blob3 { 0%, 100% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(25px, 40px) scale(0.88); } 66% { transform: translate(-25px, -30px) scale(1.1); } }
            `}</style>
            <div style={{ position: 'absolute', top: '-80px', left: '-60px', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,111,250,0.18) 0%, transparent 70%)', animation: 'blob1 8s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', bottom: '-60px', right: '-40px', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', animation: 'blob2 10s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: '35%', left: '20%', width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,111,250,0.10) 0%, transparent 70%)', animation: 'blob3 7s ease-in-out infinite' }} />
          </div>

          {/* Content above blobs */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>

          {/* Text content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: '#7c6ffa', letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: 14,
            }}>
              {module.title}
            </div>
            <div style={{
              fontSize: 22, fontWeight: 600,
              color: '#f0f1f5',
              lineHeight: 1.55,
            }}>
              {currentSub.caption}
            </div>

            {/* Sub-slide dots */}
            {currentSlide.subSlides.length > 1 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 28 }}>
                {currentSlide.subSlides.map((_, i) => (
                  <div key={i} style={{
                    width: i === subIndex ? 20 : 6,
                    height: 6,
                    borderRadius: 3,
                    background: i === subIndex ? '#7c6ffa' : 'rgba(255,255,255,0.15)',
                    transition: 'width 0.2s ease, background 0.2s ease',
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32 }}>
            <button
              onClick={handleBack}
              disabled={isFirst}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'transparent',
                color: isFirst ? 'rgba(255,255,255,0.2)' : '#9da3b8',
                fontSize: 14,
                fontWeight: 600,
                cursor: isFirst ? 'default' : 'pointer',
                transition: 'color 0.2s ease',
              }}
            >← Back</button>
            <button
              onClick={handleNext}
              style={{
                padding: '10px 28px',
                borderRadius: 12,
                border: 'none',
                background: isLastOfAll ? '#22c55e' : '#7c6ffa',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.2s ease, transform 0.1s ease',
              }}
              onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
              onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isLastOfAll ? "Let's go! 🚀" : 'Next →'}
            </button>
          </div>

          </div>{/* end content wrapper */}
        </div>

        {/* Right — image, full height */}
        <div style={{
          width: '45%',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.03)',
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {currentSub.image && currentSub.image2 ? (
            currentSub.vertical ? (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                width: '100%', height: '100%',
                padding: '16px', boxSizing: 'border-box', gap: 8,
              }}>
                <img
                  src={`/images/learn/${currentSub.image}`}
                  alt=""
                  style={{ width: '60%', maxHeight: '26%', objectFit: 'contain', borderRadius: 8 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div style={{ fontSize: 32, fontWeight: 700, color: '#7c6ffa', lineHeight: 1 }}>+</div>
                <img
                  src={`/images/learn/${currentSub.image2}`}
                  alt=""
                  style={{ width: '60%', maxHeight: '26%', objectFit: 'contain', borderRadius: 8 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                {currentSub.result && (
                  <>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#6b7290', lineHeight: 1 }}>=</div>
                    <div style={{ fontSize: 34, fontWeight: 800, color: '#22c55e', lineHeight: 1 }}>{currentSub.result}</div>
                  </>
                )}
              </div>
            ) : (
              <div style={{
                display: 'flex', flexDirection: 'row',
                alignItems: 'center', justifyContent: 'center',
                width: '100%', height: '100%',
                padding: '16px', boxSizing: 'border-box', gap: 8,
              }}>
                <img
                  src={`/images/learn/${currentSub.image}`}
                  alt=""
                  style={{ flex: 1, maxHeight: '60%', objectFit: 'contain', borderRadius: 8 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                <div style={{ fontSize: 28, fontWeight: 700, color: '#7c6ffa', flexShrink: 0, userSelect: 'none' }}>+</div>
                <img
                  src={`/images/learn/${currentSub.image2}`}
                  alt=""
                  style={{ flex: 1, maxHeight: '60%', objectFit: 'contain', borderRadius: 8 }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
                {currentSub.result && (
                  <>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#6b7290', flexShrink: 0, userSelect: 'none' }}>=</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#22c55e', flexShrink: 0, minWidth: 60, textAlign: 'center' }}>{currentSub.result}</div>
                  </>
                )}
              </div>
            )
          ) : currentSub.image ? (
            <>
              <style>{`
                @keyframes kenBurns {
                  0% { transform: scale(1); }
                  100% { transform: scale(1.05); }
                }
              `}</style>
              <img
                key={currentSub.image}
                src={`/images/learn/${currentSub.image}`}
                alt={currentSub.caption}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '20px',
                  boxSizing: 'border-box',
                  animation: 'kenBurns 10s ease-in-out infinite alternate',
                  transformOrigin: 'center center',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </>
          ) : (
            <FloatingMoney />
          )}
        </div>

      </div>
    </div>
  )
}
