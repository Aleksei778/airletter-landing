"use client"

import { useEffect, useRef } from "react"
import type * as THREE_NS from "three"

type Three = typeof THREE_NS

/**
 * Full-screen WebGL background: a folded paper plane flying a looped route
 * with a contrail, smaller "letters" in the distance, speed streaks and a
 * horizon grid. Scroll speeds the flight up and lifts the camera.
 */
export function FlightScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const altRef = useRef<HTMLElement>(null)
  const hdgRef = useRef<HTMLElement>(null)
  const sentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    // three.js is loaded lazily so it doesn't block the first paint
    import("three").then((THREE) => {
      if (disposed || !canvasRef.current) return
      cleanup = start(THREE, canvasRef.current, {
        alt: altRef.current,
        hdg: hdgRef.current,
        sent: sentRef.current,
      })
    })

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 z-0 block h-full w-full" />
      <div className="vignette" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-1/2 right-[clamp(20px,4vw,48px)] z-[3] hidden -translate-y-1/2 text-right text-[11px] leading-loose text-mute tabular-nums md:block"
      >
        alt <b ref={altRef} className="font-normal text-paper">0000</b>
        <br />
        hdg <b ref={hdgRef} className="font-normal text-paper">000</b>
        <br />
        sent <b ref={sentRef} className="font-normal text-paper">0</b>
      </div>
    </>
  )
}

type Telemetry = { alt: HTMLElement | null; hdg: HTMLElement | null; sent: HTMLElement | null }

function planeGeometry(THREE: Three) {
  const V = {
    nose: [0, 0, 2.4],
    lTip: [-1.7, 0.15, -1.2],
    rTip: [1.7, 0.15, -1.2],
    lIn: [-0.18, 0, -1.2],
    rIn: [0.18, 0, -1.2],
    keel: [0, -0.55, -1.2],
  }
  const tris = [
    [V.nose, V.lTip, V.lIn], // left wing
    [V.nose, V.rIn, V.rTip], // right wing
    [V.nose, V.lIn, V.keel], // left keel
    [V.nose, V.keel, V.rIn], // right keel
  ]
  const g = new THREE.BufferGeometry()
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(tris.flat(2)), 3))
  g.computeVertexNormals()
  return g
}

function start(THREE: Three, canvas: HTMLCanvasElement, telemetry: Telemetry): () => void {
  let renderer: THREE_NS.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  } catch {
    return () => {} // no WebGL: the black background stays
  }

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 1)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(0x000000, 20, 90)
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200)

  // hard monochrome light
  scene.add(new THREE.AmbientLight(0xffffff, 0.25))
  const key = new THREE.DirectionalLight(0xffffff, 1.4)
  key.position.set(5, 10, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xffffff, 0.5)
  rim.position.set(-6, -3, -8)
  scene.add(rim)

  const geo = planeGeometry(THREE)
  const edges = new THREE.EdgesGeometry(geo, 1)
  const paper = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.9,
    metalness: 0,
    flatShading: true,
    side: THREE.DoubleSide,
  })
  const fold = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6 })

  const makePlane = (scale: number) => {
    const g = new THREE.Group()
    g.add(new THREE.Mesh(geo, paper))
    g.add(new THREE.LineSegments(edges, fold))
    g.scale.setScalar(scale)
    scene.add(g)
    return g
  }

  // main plane and its route
  const plane = makePlane(0.9)
  const path = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-14, 2, 0),
      new THREE.Vector3(-4, 5, -10),
      new THREE.Vector3(10, 1, -6),
      new THREE.Vector3(13, -2, 6),
      new THREE.Vector3(2, -3, 10),
      new THREE.Vector3(-10, 0, 7),
    ],
    true,
    "catmullrom",
    0.5,
  )

  // small planes far away: letters already on their way
  const escorts = [0, 1, 2].map((i) => {
    const r = 26 + i * 9
    const y = 6 - i * 5
    const pts = Array.from({ length: 6 }, (_, k) => {
      const a = (k / 6) * Math.PI * 2 + i
      return new THREE.Vector3(Math.cos(a) * r, y + Math.sin(a * 2) * 2, -30 + Math.sin(a) * r * 0.5)
    })
    return {
      mesh: makePlane(0.35),
      path: new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5),
      u: i / 3,
      speed: 0.012 + i * 0.004,
    }
  })

  // contrail
  const TRAIL = 140
  const tPos = new Float32Array(TRAIL * 3)
  const tCol = new Float32Array(TRAIL * 3)
  for (let i = 0; i < TRAIL; i++) {
    const c = 1 - i / TRAIL
    tCol.set([c, c, c], i * 3)
  }
  const tg = new THREE.BufferGeometry()
  tg.setAttribute("position", new THREE.BufferAttribute(tPos, 3))
  tg.setAttribute("color", new THREE.BufferAttribute(tCol, 3))
  const trailMat = new THREE.LineBasicMaterial({ vertexColors: true })
  scene.add(new THREE.Line(tg, trailMat))
  let trailInit = false

  // speed streaks
  const N = 900
  const sPos = new Float32Array(N * 6)
  const speeds = new Float32Array(N)
  const seed = (i: number) => {
    const x = (Math.random() - 0.5) * 90
    const y = (Math.random() - 0.5) * 60
    const z = -Math.random() * 120
    const len = 0.4 + Math.random() * 2.2
    sPos.set([x, y, z, x, y, z - len], i * 6)
    speeds[i] = 0.3 + Math.random() * 0.9
  }
  for (let i = 0; i < N; i++) seed(i)
  const sg = new THREE.BufferGeometry()
  sg.setAttribute("position", new THREE.BufferAttribute(sPos, 3))
  const streakMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })
  scene.add(new THREE.LineSegments(sg, streakMat))

  // horizon grid
  const grid = new THREE.GridHelper(240, 60, 0x444444, 0x1c1c1c)
  grid.position.y = -12
  scene.add(grid)

  // input
  let mx = 0
  let my = 0
  let sy = scrollY
  const onPointer = (e: PointerEvent) => {
    mx = e.clientX / innerWidth - 0.5
    my = e.clientY / innerHeight - 0.5
  }
  const onScroll = () => {
    sy = scrollY
  }
  const resize = () => {
    renderer.setSize(innerWidth, innerHeight, false)
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
  }
  addEventListener("pointermove", onPointer)
  addEventListener("scroll", onScroll, { passive: true })
  addEventListener("resize", resize)
  resize()

  const p = new THREE.Vector3()
  const ahead = new THREE.Vector3()
  const tan = new THREE.Vector3()
  const prevTan = new THREE.Vector3(0, 0, 1)
  const tail = new THREE.Vector3()
  const tmp = new THREE.Vector3()
  let u = 0
  let bank = 0
  let sent = 0
  let frame = 0
  let last = performance.now()
  let raf = 0
  const speedK = reduce ? 0.2 : 1

  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    const scrollBoost = 1 + Math.min(sy / innerHeight, 3) * 0.35
    u = (u + dt * 0.035 * speedK * scrollBoost) % 1

    path.getPointAt(u, p)
    path.getPointAt((u + 0.004) % 1, ahead)
    path.getTangentAt(u, tan)

    plane.position.copy(p)
    plane.lookAt(ahead)
    // bank into turns
    const turn = prevTan.x * tan.z - prevTan.z * tan.x
    bank += (THREE.MathUtils.clamp(turn * 60, -0.9, 0.9) - bank) * 0.06
    plane.rotateZ(-bank)
    plane.position.y += Math.sin(now * 0.002) * 0.15
    prevTan.copy(tan)

    for (const e of escorts) {
      e.u = (e.u + dt * e.speed * speedK * scrollBoost) % 1
      e.path.getPointAt(e.u, tmp)
      e.mesh.position.copy(tmp)
      e.path.getPointAt((e.u + 0.01) % 1, tmp)
      e.mesh.lookAt(tmp)
    }

    // contrail follows the tail
    if (!trailInit) {
      for (let i = 0; i < TRAIL; i++) tPos.set([p.x, p.y, p.z], i * 3)
      trailInit = true
    }
    tPos.copyWithin(3, 0, (TRAIL - 1) * 3)
    tail.set(0, 0, -1.2).applyQuaternion(plane.quaternion).add(plane.position)
    tPos.set([tail.x, tail.y, tail.z], 0)
    tg.attributes.position.needsUpdate = true

    for (let i = 0; i < N; i++) {
      const o = i * 6
      const d = speeds[i] * dt * 30 * speedK * scrollBoost
      sPos[o + 2] += d
      sPos[o + 5] += d
      if (sPos[o + 5] > 30) seed(i)
    }
    sg.attributes.position.needsUpdate = true
    grid.position.z = (grid.position.z + dt * 8 * speedK * scrollBoost) % 4

    // camera chases from afar, drifts with mouse and scroll
    const scrollT = Math.min(sy / (document.body.scrollHeight - innerHeight || 1), 1)
    const cx = mx * 6
    const cy = 3 - my * 4 + scrollT * 10
    const cz = 32 - scrollT * 10
    camera.position.x += (cx - camera.position.x) * 0.04
    camera.position.y += (cy - camera.position.y) * 0.04
    camera.position.z += (cz - camera.position.z) * 0.04
    camera.lookAt(p.x * 0.35, p.y * 0.35 - scrollT * 4, 0)

    if (++frame % 6 === 0) {
      if (telemetry.alt) telemetry.alt.textContent = String(Math.round((p.y + 12) * 137)).padStart(4, "0")
      const hdg = ((Math.atan2(tan.x, tan.z) * 180) / Math.PI + 360) % 360
      if (telemetry.hdg) telemetry.hdg.textContent = String(Math.round(hdg)).padStart(3, "0")
      if (telemetry.sent) telemetry.sent.textContent = Math.floor(sent).toLocaleString("en")
    }
    sent += dt * 3.7 * scrollBoost

    renderer.render(scene, camera)
    raf = requestAnimationFrame(tick)
  }

  // don't burn CPU/GPU in a background tab
  const onVisibility = () => {
    cancelAnimationFrame(raf)
    if (!document.hidden) {
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
  }
  document.addEventListener("visibilitychange", onVisibility)
  raf = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(raf)
    removeEventListener("pointermove", onPointer)
    removeEventListener("scroll", onScroll)
    removeEventListener("resize", resize)
    document.removeEventListener("visibilitychange", onVisibility)
    for (const d of [geo, edges, tg, sg, grid.geometry]) d.dispose()
    for (const m of [paper, fold, trailMat, streakMat, grid.material as THREE_NS.Material]) m.dispose()
    renderer.dispose()
  }
}
