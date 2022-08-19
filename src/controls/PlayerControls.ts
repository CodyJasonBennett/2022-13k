import { vec3, quat } from 'gl-matrix'
import type { Object3D, Camera } from '../four'

const MOVEMENT_SPEED = 20
const ROLL_SPEED = 0.4

enum AXIS {
  PITCH_UP = 0,
  PITCH_DOWN = 1,
  ROLL_LEFT = 2,
  ROLL_RIGHT = 3,
  YAW_LEFT = 4,
  YAW_RIGHT = 5,
}

export class PlayerControls {
  private _player: Object3D
  private _camera: Camera
  private _frame!: number
  private _movement!: Record<AXIS, number>
  private _forward = vec3.set(vec3.create(), 0, 0, 1)
  private _v = vec3.create()
  private _q = quat.create()

  constructor(player: Object3D, camera: Camera) {
    this._player = player
    this._camera = camera
  }

  onKeyPress(event: KeyboardEvent): void {
    const value = event.type === 'keydown' ? 1 : 0
    switch (event.code) {
      case 'ArrowDown':
        return void (this._movement[AXIS.PITCH_UP] = value)
      case 'ArrowUp':
        return void (this._movement[AXIS.PITCH_DOWN] = value)
      case 'ArrowRight':
        return void (this._movement[AXIS.ROLL_RIGHT] = value)
      case 'ArrowLeft':
        return void (this._movement[AXIS.ROLL_LEFT] = value)
      case 'KeyQ':
        return void (this._movement[AXIS.YAW_RIGHT] = value)
      case 'KeyE':
        return void (this._movement[AXIS.YAW_LEFT] = value)
    }
  }

  update(delta: number): void {
    // Move player forward
    vec3.copy(this._v, this._forward)
    vec3.transformQuat(this._v, this._v, this._player.quaternion)
    vec3.scale(this._v, this._v, -delta * MOVEMENT_SPEED)
    vec3.add(this._player.position, this._player.position, this._v)

    // Rotate player
    quat.set(
      this._q,
      (this._movement[AXIS.PITCH_UP] - this._movement[AXIS.PITCH_DOWN]) * (delta * ROLL_SPEED),
      (this._movement[AXIS.YAW_LEFT] - this._movement[AXIS.YAW_RIGHT]) * (delta * ROLL_SPEED),
      (this._movement[AXIS.ROLL_LEFT] - this._movement[AXIS.ROLL_RIGHT]) * (delta * ROLL_SPEED),
      1,
    )
    quat.normalize(this._q, this._q)
    quat.multiply(this._player.quaternion, this._player.quaternion, this._q)

    // Animate follow camera
    vec3.copy(this._v, this._player.position)
    vec3.lerp(this._v, this._v, this._player.position, 0.4)

    const distance = vec3.distance(this._v, this._camera.position) - 5
    vec3.sub(this._v, this._v, this._camera.position)
    vec3.normalize(this._v, this._v)
    vec3.scaleAndAdd(this._camera.position, this._camera.position, this._v, distance)

    this._camera.lookAt(this._player.position)
    quat.copy(this._camera.quaternion, this._player.quaternion)
  }

  connect(): void {
    this._movement = {
      [AXIS.PITCH_UP]: 0,
      [AXIS.PITCH_DOWN]: 0,
      [AXIS.ROLL_LEFT]: 0,
      [AXIS.ROLL_RIGHT]: 0,
      [AXIS.YAW_LEFT]: 0,
      [AXIS.YAW_RIGHT]: 0,
    }

    this.onKeyPress = this.onKeyPress.bind(this)
    window.addEventListener('keydown', this.onKeyPress)
    window.addEventListener('keyup', this.onKeyPress)

    let prev = performance.now()
    const tick = (time: DOMHighResTimeStamp) => {
      this._frame = requestAnimationFrame(tick)
      this.update((time - prev) / 1000)
      prev = time
    }
    this._frame = requestAnimationFrame(tick)
  }

  disconnect(): void {
    window.removeEventListener('keydown', this.onKeyPress)
    window.removeEventListener('keyup', this.onKeyPress)
    cancelAnimationFrame(this._frame)
  }

  dispose(): void {
    this.disconnect()
  }
}
