
import * as THREE from "three";

// ============================================================
// SCENE 5 — QUATERNARY PROTEIN STRUCTURE
// Four irregular, intertwined amino-acid bead chains.
// ============================================================

export function initStepFiveScene() {
  const container = document.querySelector(".scene-five");

  if (!container) {
    console.error("Scene 5 container .scene-five was not found.");
    return;
  }

  if (container.dataset.proteinInitialized === "true") return;
  container.dataset.proteinInitialized = "true";

  const host = document.createElement("div");
  host.className = "protein-three-host";

  Object.assign(host.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    pointerEvents: "none",
  });

  container.appendChild(host);

  // ============================================================
  // THREE.JS SCENE
  // ============================================================

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    36,
    Math.max(container.clientWidth, 1) /
      Math.max(container.clientHeight, 1),
    0.1,
    100
  );

  camera.position.set(0, 0, 12.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  renderer.setSize(
    Math.max(container.clientWidth, 1),
    Math.max(container.clientHeight, 1)
  );

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  Object.assign(renderer.domElement.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    display: "block",
  });

  host.appendChild(renderer.domElement);

  // ============================================================
  // LIGHTING
  // ============================================================

  scene.add(
    new THREE.HemisphereLight(0xe1edff, 0x19264c, 2.1)
  );

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
  keyLight.position.set(-4, 7, 8);
  scene.add(keyLight);

  const coolFill = new THREE.DirectionalLight(0x7cbaff, 1.7);
  coolFill.position.set(6, 2, 4);
  scene.add(coolFill);

  const rimLight = new THREE.DirectionalLight(0xb79aff, 2.4);
  rimLight.position.set(1, 5, -6);
  scene.add(rimLight);

  const lowerLight = new THREE.DirectionalLight(0xffd0a2, 0.8);
  lowerLight.position.set(-5, -4, 3);
  scene.add(lowerLight);

  // ============================================================
  // PROTEIN COMPLEX AND FOLDING
  // ============================================================

  const proteinComplex = new THREE.Group();

  function foldPoint([x, y, z]) {
    // Preserve the irregular paths instead of pulling every
    // point into a compact ball.
    const centerX = x * 0.88;
    const centerY = y * 0.88;
    const centerZ = z * 1.45;

    // Gently compress only the farthest points.
    const radius = Math.sqrt(
      centerX * centerX +
      centerY * centerY +
      centerZ * centerZ
    );

    const compression =
      1 / (1 + Math.max(0, radius - 1.2) * 0.07);

    return new THREE.Vector3(
      centerX * compression,
      centerY * compression,
      centerZ * compression
    );
  }

  scene.add(proteinComplex);

  // ============================================================
  // AMINO ACID CHAINS LABEL AND POINTER
  // ============================================================

  const label = document.createElement("div");

  label.textContent = "Amino Acid Chains";

  Object.assign(label.style, {
    position: "absolute",
    left: "0",
    top: "0",
    color: "#ffffff",
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: "22px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    textShadow: "0 2px 6px rgba(0,0,0,0.45)",
    pointerEvents: "none",
    zIndex: "50",
    visibility: "hidden",
  });

  host.appendChild(label);

  // Simple white pointer line matching Scene 4.
  const pointerLine = document.createElement("div");

  Object.assign(pointerLine.style, {
    position: "absolute",
    height: "2px",
    backgroundColor: "#ffffff",
    border: "none",
    borderRadius: "0",
    boxShadow: "none",
    transformOrigin: "left center",
    pointerEvents: "none",
    zIndex: "14",
    visibility: "hidden",
  });

  host.appendChild(pointerLine);

  // Fixed point on the purple subunit's path.
  const labelTarget = foldPoint([-1.24, 2.17, 0.28]);

  // ============================================================
  // AMINO ACID CHAIN MATERIALS
  // ============================================================

  const materials = {
    orange: new THREE.MeshStandardMaterial({
      color: 0xf2ae69,
      roughness: 0.27,
      metalness: 0.04,
    }),

    purple: new THREE.MeshStandardMaterial({
      color: 0x995bd1,
      roughness: 0.28,
      metalness: 0.035,
    }),

    blue: new THREE.MeshStandardMaterial({
      color: 0x48aee2,
      roughness: 0.25,
      metalness: 0.035,
    }),

    red: new THREE.MeshStandardMaterial({
      color: 0xd85c50,
      roughness: 0.28,
      metalness: 0.035,
    }),
  };

  // ============================================================
  // ORIGINAL IRREGULAR CONTROL POINTS
  // ============================================================

  const subunits = [
    // ORANGE — uneven upper arch with a jagged inward curl
    {
      name: "orange",
      material: materials.orange,
      radius: 0.135,
      points: [
        [-0.55, 0.75, 0.75],
        [-1.20, 1.03, 0.35],
        [-1.72, 1.52, 0.12],
        [-1.88, 2.08, -0.30],
        [-1.48, 2.39, -0.52],
        [-1.19, 2.16, -0.20],
        [-0.70, 2.52, -0.48],
        [-0.19, 2.29, -0.72],
        [0.24, 1.82, -0.42],
        [0.71, 1.47, -0.10],
        [1.16, 1.19, 0.22],
        [1.70, 1.41, 0.55],
        [2.12, 1.86, 0.28],
        [2.34, 1.47, 0.02],
        [2.06, 0.96, 0.62],
        [1.64, 0.61, 0.78],
        [1.18, 0.16, 0.35],
        [0.72, -0.13, -0.02],
        [0.28, 0.18, -0.48],
        [-0.03, 0.63, -0.66],
        [-0.48, 1.05, -0.36],
        [-0.92, 0.86, 0.12],
        [-1.38, 0.49, 0.46],
        [-1.33, -0.05, 0.68],
        [-0.84, -0.31, 0.32],
        [-0.43, 0.02, 0.62],
        [-0.12, 0.48, 0.22],
        [0.34, 0.81, -0.16],
        [0.83, 0.59, -0.43],
        [1.17, 0.18, -0.26],
        [0.91, -0.35, -0.57],
        [0.42, -0.59, -0.14],
        [0.08, -0.24, 0.34],
      ],
    },

    // PURPLE — uneven outer loop with several tight reversals
    {
      name: "purple",
      material: materials.purple,
      radius: 0.13,
      points: [
        [-1.65, -0.18, -0.70],
        [-2.13, 0.18, -0.42],
        [-2.29, 0.74, -0.12],
        [-2.01, 1.29, 0.16],
        [-1.79, 1.82, -0.24],
        [-1.24, 2.17, 0.28],
        [-0.76, 1.97, 0.60],
        [-0.23, 1.68, 0.32],
        [-0.34, 1.21, 0.70],
        [-0.84, 0.96, 0.24],
        [-1.31, 1.18, -0.12],
        [-1.48, 1.57, -0.48],
        [-1.08, 1.83, -0.67],
        [-0.65, 1.55, -0.42],
        [-0.37, 1.16, -0.73],
        [-0.53, 0.70, -0.38],
        [-0.91, 0.36, -0.06],
        [-1.34, 0.03, 0.31],
        [-1.62, -0.43, 0.58],
        [-1.49, -0.95, 0.38],
        [-1.04, -1.49, 0.68],
        [-0.53, -1.55, 0.30],
        [-0.21, -1.18, -0.16],
        [-0.42, -0.78, -0.56],
        [-0.86, -0.55, -0.68],
        [-1.18, -0.82, -0.30],
        [-0.96, -1.17, 0.08],
        [-0.55, -1.05, 0.43],
        [-0.18, -0.70, 0.13],
        [0.10, -0.29, 0.63],
        [0.36, 0.12, 0.40],
        [0.12, 0.39, -0.02],
      ],
    },

    // BLUE — asymmetrical lower loop and irregular central curls
    {
      name: "blue",
      material: materials.blue,
      radius: 0.14,
      points: [
        [-0.88, 0.48, -0.45],
        [-1.35, 0.15, -0.12],
        [-1.79, -0.16, 0.26],
        [-2.12, -0.57, 0.55],
        [-1.91, -1.13, 0.32],
        [-1.76, -1.64, 0.69],
        [-1.19, -2.01, 0.40],
        [-0.66, -1.81, 0.02],
        [-0.19, -1.61, -0.32],
        [0.19, -1.20, -0.56],
        [0.05, -0.73, -0.26],
        [-0.35, -0.46, -0.67],
        [-0.79, -0.59, -0.37],
        [-1.06, -0.96, -0.05],
        [-0.78, -1.31, 0.30],
        [-0.31, -1.29, 0.60],
        [0.12, -1.04, 0.38],
        [0.28, -0.61, 0.72],
        [0.02, -0.26, 0.48],
        [-0.35, 0.04, 0.15],
        [-0.70, 0.35, -0.18],
        [-0.55, 0.76, -0.51],
        [-0.14, 1.01, -0.25],
        [0.31, 0.75, -0.62],
        [0.58, 0.34, -0.39],
        [0.43, -0.08, -0.72],
        [0.11, -0.39, -0.25],
        [-0.25, -0.23, 0.02],
        [-0.27, 0.13, 0.34],
        [0.08, 0.34, 0.62],
        [0.47, 0.11, 0.36],
        [0.38, -0.34, 0.04],
      ],
    },

    // RED — uneven lower-right loops with sharper changes
    {
      name: "red",
      material: materials.red,
      radius: 0.135,
      points: [
        [0.72, 0.15, 0.72],
        [1.24, 0.44, 0.42],
        [1.71, 0.29, 0.12],
        [1.96, -0.13, -0.20],
        [1.73, -0.52, -0.48],
        [1.29, -0.72, -0.64],
        [0.91, -0.43, -0.36],
        [0.82, -0.02, -0.68],
        [1.13, 0.27, -0.43],
        [1.52, 0.12, -0.04],
        [1.62, -0.29, 0.27],
        [1.23, -0.57, 0.51],
        [0.94, -0.91, 0.24],
        [0.61, -1.29, 0.54],
        [0.72, -1.78, 0.34],
        [1.12, -2.08, -0.06],
        [1.64, -2.15, -0.36],
        [2.07, -1.79, -0.18],
        [2.29, -1.35, -0.56],
        [2.06, -0.91, -0.35],
        [1.68, -0.77, 0.03],
        [1.37, -0.95, 0.36],
        [1.18, -1.34, 0.60],
        [1.42, -1.69, 0.37],
        [1.80, -1.58, 0.63],
        [2.01, -1.24, 0.29],
        [1.76, -0.94, -0.10],
        [1.39, -0.82, -0.43],
        [1.01, -0.61, -0.65],
        [0.72, -0.28, -0.35],
        [0.55, 0.04, 0.10],
        [0.86, 0.31, 0.48],
      ],
    },
  ];

  // ============================================================
  // BEAD-CHAIN CONSTRUCTION
  // ============================================================

  const beadGeometry = new THREE.SphereGeometry(1, 20, 16);

  const connectorGeometry = new THREE.CylinderGeometry(
    1,
    1,
    1,
    10,
    1
  );

  const up = new THREE.Vector3(0, 1, 0);

  function makePipe(config) {
    const group = new THREE.Group();

    // Apply the folding transformation to each control point.
    const points = config.points.map(foldPoint);

    const curve = new THREE.CatmullRomCurve3(
      points,
      false,
      "centripetal",
      0.45
    );

    // Slightly separated beads help individual amino-acid units
    // remain visible along each irregular chain.
    const beadRadius = config.radius * 0.76;
    const connectorRadius = beadRadius * 0.30;
    const spacing = beadRadius * 2.65;

    const beadCount = Math.max(
      2,
      Math.ceil(curve.getLength() / spacing) + 1
    );

    const positions = [];

    for (let i = 0; i < beadCount; i++) {
      positions.push(
        curve.getPointAt(i / (beadCount - 1))
      );
    }

    // Connectors first, so the spheres cover their ends.
    const connectorMaterial = config.material.clone();
    connectorMaterial.roughness = 0.34;

    for (let i = 0; i < positions.length - 1; i++) {
      const start = positions[i];
      const end = positions[i + 1];

      const direction = new THREE.Vector3().subVectors(
        end,
        start
      );

      const distance = direction.length();

      if (distance < 0.001) continue;

      const connector = new THREE.Mesh(
        connectorGeometry,
        connectorMaterial
      );

      connector.position
        .copy(start)
        .add(end)
        .multiplyScalar(0.5);

      connector.scale.set(
        connectorRadius,
        distance,
        connectorRadius
      );

      connector.quaternion.setFromUnitVectors(
        up,
        direction.normalize()
      );

      group.add(connector);
    }

    // Each amino-acid bead retains its original subunit color.
    for (const position of positions) {
      const bead = new THREE.Mesh(
        beadGeometry,
        config.material
      );

      bead.position.copy(position);
      bead.scale.setScalar(beadRadius);
      bead.castShadow = false;
      bead.receiveShadow = false;

      group.add(bead);
    }

    proteinComplex.add(group);
  }

  subunits.forEach(makePipe);

  // ============================================================
  // MODEL POSITION AND ROTATION
  // ============================================================

  proteinComplex.rotation.set(-0.12, -0.17, -0.04);
  proteinComplex.scale.set(1.0, 1.0, 1.0);
  proteinComplex.position.set(0, 0.05, 0);

  // ============================================================
  // RESIZE HANDLING
  // ============================================================

  function resize() {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);

    camera.aspect = width / height;
    camera.position.z = width < 600 ? 14.0 : 12.5;
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  // ============================================================
  // SLOW 3D ANIMATION
  // ============================================================

  const clock = new THREE.Clock();
  let animationFrame = 0;
  let isDisposed = false;

  function animate() {
    if (isDisposed) return;

    animationFrame = requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // One complete 360-degree rotation every 40 seconds.
    proteinComplex.rotation.y =
      -0.17 + time * (Math.PI * 2 / 40);

    // Keep the other axes steady.
    proteinComplex.rotation.x = -0.10;
    proteinComplex.rotation.z = -0.045;

    // Update the pointer as the protein rotates.
    const targetWorld = proteinComplex.localToWorld(
      labelTarget.clone()
    );

    const projected = targetWorld.clone().project(camera);

    const width = host.clientWidth;
    const height = host.clientHeight;

    const targetX = (projected.x * 0.5 + 0.5) * width;
    const targetY = (-projected.y * 0.5 + 0.5) * height;

    const labelX = width * 0.06;
    const labelY = height * 0.12;

    label.style.left = `${labelX}px`;
    label.style.top = `${labelY}px`;

    const labelWidth = label.offsetWidth;
    const labelHeight = label.offsetHeight;

    const startX = labelX + labelWidth;
    const startY = labelY + labelHeight * 0.5;

    const targetVisible =
      projected.z >= -1 &&
      projected.z <= 1 &&
      targetX >= 0 &&
      targetX <= width &&
      targetY >= 0 &&
      targetY <= height;

    label.style.visibility = targetVisible
      ? "visible"
      : "hidden";

    pointerLine.style.visibility = targetVisible
      ? "visible"
      : "hidden";

    const dx = targetX - startX;
    const dy = targetY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    Object.assign(pointerLine.style, {
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${length}px`,
      transform: `rotate(${angle}rad)`,
    });

    renderer.render(scene, camera);
  }

  animate();

  // ============================================================
  // CLEANUP
  // ============================================================

  container.disposeProteinScene = function () {
    isDisposed = true;

    cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();

    proteinComplex.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }

      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) =>
            material.dispose()
          );
        } else {
          object.material.dispose();
        }
      }
    });

    // Shared geometries and original materials.
    beadGeometry.dispose();
    connectorGeometry.dispose();

    Object.values(materials).forEach((material) => {
      material.dispose();
    });

    renderer.dispose();
    renderer.domElement.remove();
    host.remove();

    delete container.dataset.proteinInitialized;
    delete container.disposeProteinScene;
  };
}
