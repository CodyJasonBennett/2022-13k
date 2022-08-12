const canvas = document.body.appendChild(document.createElement('canvas'))
const ctx = canvas.getContext('2d')!

function handleResize(): void {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  ctx.beginPath()
  ctx.rect(0, 0, window.innerWidth, window.innerHeight)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
  ctx.fill()
}
window.addEventListener('resize', handleResize)
handleResize()
