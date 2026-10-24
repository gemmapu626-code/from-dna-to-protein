
import * as THREE from "three";

/*
  SCENE 6 — INTERACTIVE 3D PROTEIN VIEWER

  This is a separate module. It does not modify Scenes 1–5.

  Example integration:
  import mountSceneSix3D from "./scene-six-3d.js";

  const sceneSix = mountSceneSix3D(
    document.querySelector("#scene-six")
  );

  When leaving Scene 6:
  sceneSix.dispose();
*/

export function initStepSixScene() {
  const container = document.querySelector(
    "#scene-six-3d-container"
  );

  if (!container) {
    throw new Error("Scene 6 container not found.");
  }
  
  if (!container) {
    throw new Error(
      'Scene 6 needs a container element with id="scene-six".'
    );
  }

  const root = document.createElement("section");
  root.className = "scene-six-3d";

  Object.assign(root.style, {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: "620px",
    overflow: "hidden",
    color: "#ffffff",
    fontFamily: "Arial, Helvetica, sans-serif",
    background:
      "radial-gradient(ellipse at center, #102b58 0%, #06172f 60%, #020917 100%)",
    borderRadius: "12px",
    isolation: "isolate"
  });

  root.innerHTML = `
    <style>
      .s6-heading {
        position: absolute;
        top: 22px;
        left: 24px;
        z-index: 3;
        max-width: 430px;
        pointer-events: none;
      }

      .s6-badge {
        display: inline-block;
        padding: 6px 13px;
        border-radius: 20px;
        background: #075bc5;
        border: 1px solid #328cff;
        font-size: 14px;
        font-weight: bold;
      }

      .s6-heading h2 {
        margin: 14px 0 8px;
        font-size: clamp(25px, 3vw, 38px);
      }

      .s6-heading p {
        margin: 0;
        color: #9acbff;
        font-size: 15px;
        line-height: 1.6;
      }

      .s6-view-modes {
        position: absolute;
        z-index: 4;
        left: 22px;
        top: 33%;
        display: flex;
        flex-direction: column;
        gap: 9px;
        width: 145px;
      }

      .s6-mode {
        padding: 13px 12px;
        border: 1px solid #174b91;
        border-radius: 12px;
        background: rgba(4, 28, 67, .88);
        color: #c6ddff;
        text-align: left;
        font: 600 14px Arial, sans-serif;
        cursor: pointer;
      }

      .s6-mode:hover {
        border-color: #54aaff;
      }

      .s6-mode.active {
        color: white;
        background: linear-gradient(110deg, #0876ed, #0753b7);
        border-color: #4ba5ff;
      }

      .s6-mode span {
        display: inline-block;
        width: 24px;
        margin-right: 7px;
        text-align: center;
      }

      .s6-info {
        position: absolute;
        z-index: 4;
        top: 24px;
        right: 22px;
        width: 185px;
        padding: 17px;
        border: 1px solid #19477f;
        border-radius: 15px;
        background: rgba(3, 18, 43, .9);
        box-sizing: border-box;
      }

      .s6-info h3 {
        margin: 0 0 13px;
        font-size: 16px;
      }

      .s6-chain {
        display: flex;
        align-items: center;
        gap: 9px;
        margin: 12px 0;
        color: #e1edff;
        font-size: 14px;
      }

      .s6-dot {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .s6-separator {
        height: 1px;
        background: #1c3c69;
        margin: 15px 0;
      }

      .s6-detail {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin: 10px 0;
        color: #9fcaff;
        font-size: 12px;
      }

      .s6-detail strong {
        color: white;
        font-weight: 500;
        text-align: right;
      }

      .s6-controls {
        position: absolute;
        z-index: 4;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        padding: 5px;
        border: 1px solid #194b8c;
        border-radius: 30px;
        background: rgba(3, 20, 48, .94);
      }

      .s6-control {
        padding: 11px 15px;
        border: 1px solid #164786;
        border-radius: 25px;
        background: transparent;
        color: #d2e7ff;
        font: 600 13px Arial, sans-serif;
        cursor: pointer;
        white-space: nowrap;
      }

      .s6-control:hover {
        background: #0b3670;
      }

      .s6-control.primary {
        background: #086be0;
        border-color: #278cff;
        color: white;
      }

      .s6-hint {
        position: absolute;
        right: 22px;
        bottom: 29px;
        z-index: 3;
        color: #9cc9ff;
        font-size: 12px;
        pointer-events: none;
      }

      .s6-canvas {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        min-height: 620px;
        cursor: grab;
        touch-action: none;
      }

      .s6-canvas:active {
        cursor: grabbing;
      }

      @media (max-width: 760px) {
        .s6-heading {
          left: 15px;
          top: 15px;
          max-width: 65%;
        }

        .s6-heading p {
          font-size: 12px;
        }

        .s6-view-modes {
          left: 10px;
          bottom: 88px;
          top: auto;
          width: 112px;
          gap: 6px;
        }

        .s6-mode {
          padding: 9px 7px;
          font-size: 12px;
        }

        .s6-mode span {
          width: 17px;
          margin-right: 3px;
        }

        .s6-info {
          top: auto;
          right: 10px;
          bottom: 88px;
          width: 140px;
          padding: 10px;
        }

        .s6-info h3 {
          font-size: 13px;
        }

        .s6-chain {
          font-size: 11px;
          margin: 8px 0;
        }

        .s6-detail {
          font-size: 10px;
        }

        .s6-controls {
          bottom: 10px;
          gap: 3px;
        }

        .s6-control {
          padding: 9px 10px;
          font-size: 11px;
        }

        .s6-hint {
          display: none;
        }
      }
    </style>

    <header class="s6-heading">
      <span class="s6-badge">Scene 6</span>
      <h2>The Finished Protein</h2>
      <p>
        Amino-acid chains fold into a three-dimensional
        structure with distinct shapes and functions.
      </p>
    </header>

    <nav class="s6-view-modes" aria-label="Protein display style">
      <button class="s6-mode active" data-mode="ribbon">
        <span>〰</span>Ribbon
      </button>
      <button class="s6-mode" data-mode="surface">
        <span>◉</span>Surface
      </button>
      <button class="s6-mode" data-mode="beads">
        <span>●</span>Beads
      </button>
      <button class="s6-mode" data-mode="backbone">
        <span>⌁</span>Backbone
      </button>
    </nav>

    <aside class="s6-info">
      <h3>Chains</h3>

      <div class="s6-chain">
        <i class="s6-dot" style="background:#3295ff"></i>
        Chain A
      </div>

      <div class="s6-chain">
        <i class="s6-dot" style="background:#ffad32"></i>
        Chain B
      </div>

      <div class="s6-chain">
        <i class="s6-dot" style="background:#a56aff"></i>
        Chain C
      </div>

      <div class="s6-chain">
        <i class="s6-dot" style="background:#ff5268"></i>
        Chain D
      </div>

      <div class="s6-separator"></div>

      <h3>Structure Details</h3>

      <div class="s6-detail">
        <span>Model</span>
        <strong>Illustrative</strong>
      </div>

      <div class="s6-detail">
        <span>Chains</span>
        <strong>4</strong>
      </div>

      <div class="s6-detail">
        <span>View</span>
        <strong class="s6-current-view">Ribbon</strong>
      </div>

      <div class="s6-detail">
        <span>Rotation</span>
        <strong class="s6-rotation-state">On</strong>
      </div>
    </aside>

    <div class="s6-controls">
      <button class="s6-control primary" data-action="play">
        ▶ Play
      </button>

      <button class="s6-control" data-action="pause">
        Ⅱ Pause
      </button>

      <button class="s6-control" data-action="reset">
        ↺ Reset
      </button>
    </div>

    <div class="s6-hint">
      Drag to rotate · Scroll to zoom
    </div>
  `;

  container.appendChild(root);

  const canvas = document.createElement("canvas");
  canvas.className = "s6-canvas";
  canvas.setAttribute(
    "aria-label",
    "Interactive 3D protein model with four colored chains"
  );
  root.insertBefore(canvas, root.firstChild);

  // --------------------------------------------------
  // THREE.JS SCENE
  // --------------------------------------------------

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06152f, 0.025);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 11.5);

  scene.add(
    new THREE.HemisphereLight(0xd7eaff, 0x11152c, 2.0)
  );

  const keyLight = new THREE.DirectionalLight(0xffffff, 3);
  keyLight.position.set(4, 6, 8);
  scene.add(keyLight);

  const blueLight = new THREE.PointLight(0x2088ff, 35, 18);
  blueLight.position.set(-4, 1, 4);
  scene.add(blueLight);

  const warmLight = new THREE.PointLight(0xffa83a, 22, 16);
  warmLight.position.set(4, -1, 3);
  scene.add(warmLight);

  const protein = new THREE.Group();
  protein.position.set(0.15, -0.2, 0);
  scene.add(protein);

  const colors = [
    0x3295ff,
    0xffad32,
    0xa56aff,
    0xff5268
  ];

  const chainGroups = [];

  const views = {
    ribbon: [],
    surface: [],
    beads: [],
    backbone: [],
    markers: []
  };

  function makeMaterial(color, roughness = 0.3) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness: 0.08,
      emissive: color,
      emissiveIntensity: 0.08
    });
  }

  // --------------------------------------------------
  // CREATE IRREGULAR FOLDED CHAIN PATHS
  // These are illustrative paths, not real PDB data.
  // --------------------------------------------------

  function createChainPath(index) {
    const centers = [
      [-0.95, 0.8, 0.1],
      [0.95, 0.8, -0.1],
      [-0.85, -0.75, 0.15],
      [0.85, -0.75, -0.1]
    ];

    const [cx, cy, cz] = centers[index];
    const phase = index * 1.7;
    const points = [];

    for (let i = 0; i < 48; i++) {
      const t = i / 47;
      const angle = t * Math.PI * 4.8 + phase;
      const envelope =
        0.35 + 0.5 * Math.sin(Math.PI * t);

      const irregular =
        0.14 * Math.sin(t * 17 + phase) +
        0.09 * Math.cos(t * 29 + phase);

      points.push(
        new THREE.Vector3(
          cx +
            Math.cos(angle) * envelope +
            0.23 * Math.sin(t * 10 + phase) +
            irregular,

          cy +
            Math.sin(angle * 0.83) * envelope +
            0.22 * Math.cos(t * 13 + phase),

          cz +
            0.55 * Math.sin(angle * 0.65 + phase) +
            0.2 * Math.cos(t * 19 + phase)
        )
      );
    }

    return new THREE.CatmullRomCurve3(
      points,
      false,
      "centripetal",
      0.5
    );
  }

  function createRibbon(curve, color) {
    const segments = 220;
    const width = 0.105;

    const positions = [];
    const indices = [];

    const frames = curve.computeFrenetFrames(
      segments,
      false
    );

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = curve.getPointAt(t);

      const normal = frames.normals[i];
      const binormal = frames.binormals[i];

      const twist = Math.sin(t * Math.PI * 8) * 0.45;

      const side = normal
        .clone()
        .multiplyScalar(Math.cos(twist))
        .add(
          binormal
            .clone()
            .multiplyScalar(Math.sin(twist))
        )
        .normalize();

      const w =
        width *
        (0.72 + 0.28 * Math.sin(t * Math.PI * 9) ** 2);

      positions.push(
        point.x + side.x * w,
        point.y + side.y * w,
        point.z + side.z * w,

        point.x - side.x * w,
        point.y - side.y * w,
        point.z - side.z * w
      );

      if (i < segments) {
        const a = i * 2;

        indices.push(
          a, a + 1, a + 2,
          a + 1, a + 3, a + 2
        );
      }
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.27,
      metalness: 0.08,
      emissive: color,
      emissiveIntensity: 0.12,
      side: THREE.DoubleSide
    });

    return new THREE.Mesh(geometry, material);
  }

  function createTube(curve, radius, material) {
    return new THREE.Mesh(
      new THREE.TubeGeometry(
        curve,
        180,
        radius,
        8,
        false
      ),
      material
    );
  }

  // --------------------------------------------------
  // BUILD THE FOUR CHAINS
  // --------------------------------------------------

  colors.forEach((color, index) => {
    const group = new THREE.Group();
    group.name = `Chain ${String.fromCharCode(65 + index)}`;

    const curve = createChainPath(index);

    const ribbon = createRibbon(curve, color);

    const backbone = createTube(
      curve,
      0.026,
      makeMaterial(color, 0.42)
    );

    const beads = new THREE.Group();
    const surface = new THREE.Group();

    const beadGeometry = new THREE.SphereGeometry(
      0.075,
      12,
      10
    );

    const beadMaterial = makeMaterial(color, 0.25);

    for (let i = 0; i < 38; i++) {
      const t = i / 37;
      const point = curve.getPointAt(t);

      const bead = new THREE.Mesh(
        beadGeometry,
        beadMaterial
      );

      bead.position.copy(point);
      beads.add(bead);

      const surfaceMaterial =
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.4,
          transparent: true,
          opacity: 0.12,
          depthWrite: false,
          emissive: color,
          emissiveIntensity: 0.04
        });

      const blob = new THREE.Mesh(
        new THREE.SphereGeometry(
          0.22 + 0.025 * Math.sin(i * 1.7),
          12,
          10
        ),
        surfaceMaterial
      );

      blob.position.copy(point);
      surface.add(blob);
    }

    group.add(ribbon, backbone, beads, surface);
    protein.add(group);
    chainGroups.push(group);

    views.ribbon.push(ribbon);
    views.backbone.push(backbone);
    views.beads.push(beads);
    views.surface.push(surface);

    // Colored end markers identify each chain.
    [curve.getPointAt(0), curve.getPointAt(1)].forEach(
      (point) => {
        const marker = new THREE.Mesh(
          new THREE.SphereGeometry(0.07, 12, 10),
          makeMaterial(color)
        );

        marker.position.copy(point);
        group.add(marker);
        views.markers.push(marker);
      }
    );
  });

  // --------------------------------------------------
  // VIEW MODES
  // --------------------------------------------------

  let activeMode = "ribbon";

  function setMode(mode) {
    if (!views[mode]) return;

    activeMode = mode;

    Object.entries(views).forEach(([name, objects]) => {
      objects.forEach((object) => {
        object.visible =
          name === "markers" || name === mode;
      });
    });

    root.querySelectorAll(".s6-mode").forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.mode === mode
      );
    });

    root.querySelector(".s6-current-view").textContent =
      mode.charAt(0).toUpperCase() + mode.slice(1);
  }

  // --------------------------------------------------
  // ROTATION, ZOOM AND CONTROLS
  // --------------------------------------------------

  let playing = true;
  let dragging = false;
  let previousX = 0;
  let previousY = 0;

  let yaw = 0;
  let pitch = 0;

  let targetYaw = 0;
  let targetPitch = 0;

  let zoom = 11.5;
  let targetZoom = 11.5;

  function updateRotationLabel() {
    root.querySelector(".s6-rotation-state").textContent =
      playing ? "On" : "Off";
  }

  function resetView() {
    yaw = 0;
    pitch = 0;
    targetYaw = 0;
    targetPitch = 0;
    zoom = 11.5;
    targetZoom = 11.5;

    protein.position.set(0.15, -0.2, 0);

    playing = true;
    updateRotationLabel();
  }

  canvas.addEventListener("pointerdown", (event) => {
    dragging = true;
    previousX = event.clientX;
    previousY = event.clientY;

    canvas.setPointerCapture?.(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!dragging) return;

    const dx = event.clientX - previousX;
    const dy = event.clientY - previousY;

    previousX = event.clientX;
    previousY = event.clientY;

    targetYaw += dx * 0.008;

    targetPitch = THREE.MathUtils.clamp(
      targetPitch + dy * 0.008,
      -1.15,
      1.15
    );
  });

  function stopDragging() {
    dragging = false;
  }

  canvas.addEventListener("pointerup", stopDragging);
  canvas.addEventListener("pointercancel", stopDragging);

  canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();

      targetZoom = THREE.MathUtils.clamp(
        targetZoom + event.deltaY * 0.008,
        7,
        18
      );
    },
    { passive: false }
  );

  root.addEventListener("click", (event) => {
    const modeButton = event.target.closest("[data-mode]");

    if (modeButton) {
      setMode(modeButton.dataset.mode);
      return;
    }

    const actionButton = event.target.closest("[data-action]");

    if (!actionButton) return;

    switch (actionButton.dataset.action) {
      case "play":
        playing = true;
        updateRotationLabel();
        break;

      case "pause":
        playing = false;
        updateRotationLabel();
        break;

      case "reset":
        resetView();
        break;
    }
  });

  // --------------------------------------------------
  // RESIZE AND RENDER
  // --------------------------------------------------

  function resize() {
    const width = Math.max(1, root.clientWidth);
    const height = Math.max(1, root.clientHeight);

    renderer.setSize(width, height, false);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(resize)
      : null;

  resizeObserver?.observe(root);
  window.addEventListener("resize", resize);

  setMode("ribbon");
  resize();

  let frameId = 0;
  let lastTime = 0;
  let disposed = false;

  function animate(time) {
    if (disposed) return;

    frameId = requestAnimationFrame(animate);

    const delta = lastTime
      ? Math.min((time - lastTime) / 1000, 0.05)
      : 0;

    lastTime = time;

    if (playing && !dragging) {
      targetYaw += delta * 0.18;
    }

    yaw += (targetYaw - yaw) * 0.08;
    pitch += (targetPitch - pitch) * 0.08;
    zoom += (targetZoom - zoom) * 0.1;

    protein.rotation.set(pitch, yaw, 0);

    camera.position.z = zoom;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  frameId = requestAnimationFrame(animate);

  // --------------------------------------------------
  // CLEANUP WHEN LEAVING SCENE 6
  // --------------------------------------------------

  function dispose() {
    if (disposed) return;

    disposed = true;

    cancelAnimationFrame(frameId);
    resizeObserver?.disconnect();
    window.removeEventListener("resize", resize);

    canvas.removeEventListener("pointerup", stopDragging);
    canvas.removeEventListener("pointercancel", stopDragging);

    scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => material.dispose());
      }
    });

    renderer.dispose();
    root.remove();
  }

  return {
    element: root,
    setMode,
    play() {
      playing = true;
      updateRotationLabel();
    },
    pause() {
      playing = false;
      updateRotationLabel();
    },
    reset: resetView,
    dispose
  };
}
