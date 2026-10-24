import * as THREE from "three";

const TAU = Math.PI * 2;

const pairColors = [
  [0x9beaff, 0x5bc4ec],
  [0x82e0fa, 0x43b0e1],
  [0xa4efff, 0x68c9ef],
  [0x78d6f5, 0x3da4d8],
];

function createMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.4,
    metalness: 0.05,
    ...options,
  });
}

function createBeam(start, end, radius, material) {
  const direction = end.clone().sub(start);
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, direction.length(), 14),
    material,
  );

  beam.position.copy(start).add(end).multiplyScalar(0.5);
  beam.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize(),
  );
  beam.castShadow = true;
  beam.receiveShadow = true;
  return beam;
}

function createHelixCurve(phase, start = 0, end = 1) {
  const points = [];
  const radius = 1.25;
  const height = 6.8;
  const turns = 2.25;
  const samples = Math.max(12, Math.ceil((end - start) * 150));

  for (let index = 0; index <= samples; index += 1) {
    const t = start + ((end - start) * index) / samples;
    const angle = t * turns * TAU + phase;
    points.push(
      new THREE.Vector3(
        radius * Math.cos(angle),
        height / 2 - t * height,
        radius * Math.sin(angle),
      ),
    );
  }

  return new THREE.CatmullRomCurve3(points);
}

function setShadowState(object, castShadow = false) {
  object.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });
}

function projectPoint(point, object, camera, width, height) {
  const projected = point.clone();
  object.localToWorld(projected);
  projected.project(camera);
  return {
    x: (projected.x * 0.5 + 0.5) * width,
    y: (-projected.y * 0.5 + 0.5) * height,
  };
}

function placeLabel(element, point, xOffset, yOffset) {
  const x = point.x + xOffset;
  const y = point.y + yOffset;
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
  return { x, y };
}

function placeLine(element, start, end) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  element.style.left = `${start.x}px`;
  element.style.top = `${start.y}px`;
  element.style.width = `${Math.hypot(dx, dy)}px`;
  element.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
}

export function initStepOneScene() {
  const canvas = document.querySelector("#step-one-3d-canvas");
  const sceneRoot = document.querySelector(".scene-one");

  if (!canvas || !sceneRoot) {
    return;
  }

  let renderer;
  let webglContext;

  try {
    webglContext =
      canvas.getContext("webgl2", { antialias: true, alpha: true }) ||
      canvas.getContext("webgl", { antialias: true, alpha: true });
  } catch {
    sceneRoot.dataset.threeUnavailable = "true";
    return;
  }

  if (!webglContext) {
    sceneRoot.dataset.threeUnavailable = "true";
    return;
  }

  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      context: webglContext,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch {
    sceneRoot.dataset.threeUnavailable = "true";
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.2, 25.5);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.65;

  scene.add(new THREE.HemisphereLight(0xa7d8ff, 0x160d46, 1.3));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
  keyLight.position.set(-6, 9, 10);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 30;
  keyLight.shadow.camera.left = -10;
  keyLight.shadow.camera.right = 10;
  keyLight.shadow.camera.top = 10;
  keyLight.shadow.camera.bottom = -10;
  scene.add(keyLight);

  const cellGroup = new THREE.Group();
  cellGroup.scale.set(1.28, 0.88, 0.78);
  scene.add(cellGroup);

  const cellShell = new THREE.Mesh(
    new THREE.SphereGeometry(7.8, 64, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x9edfff,
      transparent: true,
      opacity: 0.10,
      roughness: 0.4,
      metalness: 0.0,
      clearcoat: 0.15,
      side: THREE.DoubleSide,
    }),
  );

  cellShell.receiveShadow = true;
  cellGroup.add(cellShell);

  // Smooth visible cell membrane — no mesh/wireframe pattern
  const cellMembrane = new THREE.Mesh(
    new THREE.SphereGeometry(7.86, 64, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x9fdcff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.28,
      metalness: 0.02,
      clearcoat: 0.65,
      clearcoatRoughness: 0.18,
      side: THREE.DoubleSide,
      wireframe: false,
    }),
  );

  cellMembrane.castShadow = false;
  cellMembrane.receiveShadow = false;
  cellGroup.add(cellMembrane);



  // Simple 3D cell organelles

  function createMitochondrion(position, scale, rotation = 0) {
    const mitochondrion = new THREE.Group();

    // Bean-shaped outer mitochondrion
    const outer = new THREE.Mesh(
      new THREE.SphereGeometry(0.82, 32, 20),
      new THREE.MeshPhysicalMaterial({
        color: 0xe79a4a,
        roughness: 0.38,
        metalness: 0.02,
        clearcoat: 0.35,
        clearcoatRoughness: 0.25,
      }),
    );

    outer.scale.set(scale[0], scale[1], scale[2]);
    outer.castShadow = true;
    outer.receiveShadow = true;
    mitochondrion.add(outer);

    // Inner folded membrane
    const cristaeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc56b,
      roughness: 0.4,
      metalness: 0.01,
    });

    const fold1 = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.065, 8, 24, Math.PI * 1.35),
      cristaeMaterial,
    );

    fold1.rotation.y = Math.PI / 2;
    fold1.position.x = -0.12;
    fold1.scale.set(1.0, 0.55, 0.6);
    mitochondrion.add(fold1);

    const fold2 = fold1.clone();
    fold2.position.x = 0.15;
    fold2.rotation.z = Math.PI * 0.08;
    mitochondrion.add(fold2);

    mitochondrion.position.set(...position);
    mitochondrion.rotation.z = rotation;

    cellGroup.add(mitochondrion);
  }

  // Bean-shaped mitochondria
  createMitochondrion(
    [-5.0, 2.5, -1.5],
    [1.25, 0.62, 0.55],
    -0.25,
  );

  createMitochondrion(
    [5.0, -2.2, -1.2],
    [1.05, 0.52, 0.48],
    0.35,
  );

  createMitochondrion(
    [-4.7, -3.0, -0.8],
    [0.9, 0.45, 0.42],
    -0.4,
  );



  // More realistic Golgi apparatus
  const golgiGroup = new THREE.Group();

  golgiGroup.position.set(4.0, 4.3, -1.0);
  golgiGroup.rotation.z = -0.22;

  const golgiMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x72d6b0,
    roughness: 0.36,
    metalness: 0.02,
    clearcoat: 0.35,
    clearcoatRoughness: 0.3,
  });

  for (let index = 0; index < 5; index += 1) {
    const width = 1.15 - index * 0.06;

    const cisterna = new THREE.Mesh(
      new THREE.TorusGeometry(
        0.72 - index * 0.045,
        0.12,
        12,
        40,
        Math.PI * 1.55,
      ),
      golgiMaterial,
    );

    cisterna.scale.set(width, 0.58, 0.72);

    cisterna.rotation.x = Math.PI / 2;

    cisterna.position.y = (index - 2) * 0.27;

    cisterna.castShadow = true;
    cisterna.receiveShadow = true;

    golgiGroup.add(cisterna);
  }

  // Small Golgi vesicles
  const golgiVesiclePositions = [
    [1.25, 0.55, 0.05],
    [1.35, -0.25, 0.08],
    [1.05, -0.75, 0.02],
  ];

  golgiVesiclePositions.forEach(([x, y, z], index) => {
    const vesicle = new THREE.Mesh(
      new THREE.SphereGeometry(0.13 + index * 0.025, 16, 12),
      new THREE.MeshPhysicalMaterial({
        color: 0x8ee6c5,
        roughness: 0.3,
        clearcoat: 0.4,
      }),
    );

    vesicle.position.set(x, y, z);
    vesicle.castShadow = true;
    golgiGroup.add(vesicle);
  });

  cellGroup.add(golgiGroup);




  // Small vesicles
  const vesiclePositions = [
    [-2.8, 3.4, -1.0],
    [3.0, -3.2, -0.8],
    [5.2, 1.0, -1.5],
    [-4.0, 0.2, -1.0],
  ];

  vesiclePositions.forEach((position) => {
    const vesicle = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 18, 12),
      new THREE.MeshPhysicalMaterial({
        color: 0xb98cff,
        transparent: true,
        opacity: 0.7,
        roughness: 0.25,
        clearcoat: 0.5,
      }),
    );

    vesicle.position.set(...position);
    vesicle.castShadow = true;
    cellGroup.add(vesicle);
  });


  const nucleusGroup = new THREE.Group();
  cellGroup.add(nucleusGroup);


  
  // NUCLEUS
  // Very subtle interior so the DNA stays clear
  const nucleusInterior = new THREE.Mesh(
    new THREE.SphereGeometry(4.0, 64, 48),
    new THREE.MeshStandardMaterial({
      color: 0x9b78cf,
      transparent: true,
      opacity: 0.025,
      roughness: 0.5,
      metalness: 0.0,
      depthWrite: false,
    }),
  );

  // Make the nucleus narrower horizontally
  nucleusInterior.scale.set(0.78, 1.08, 0.88);
  nucleusInterior.renderOrder = 0;
  nucleusGroup.add(nucleusInterior);


  // Create a clean oval curve for the nuclear membrane
  function createNucleusMembrane(radiusX, radiusY, zOffset) {
    const points = [];

    for (let i = 0; i <= 96; i += 1) {
      const angle = (i / 96) * Math.PI * 2;

      points.push(
        new THREE.Vector3(
          radiusX * Math.cos(angle),
          radiusY * Math.sin(angle),
          zOffset,
        ),
      );
    }

    return new THREE.CatmullRomCurve3(points, true);
  }


  // Inner membrane
  const innerMembraneCurve = createNucleusMembrane(
    4.05,
    4.25,
    0.05,
  );

  const innerMembrane = new THREE.Mesh(
    new THREE.TubeGeometry(
      innerMembraneCurve,
      96,
      0.035,
      10,
      true,
    ),
    new THREE.MeshBasicMaterial({
      color: 0xc9a7ff,
      transparent: true,
      opacity: 0.75,
      depthTest: false,
    }),
  );

  innerMembrane.scale.set(0.78, 1.08, 0.88);
  innerMembrane.renderOrder = 10;
  nucleusGroup.add(innerMembrane);


  // Outer membrane
  const outerMembraneCurve = createNucleusMembrane(
    4.16,
    4.36,
    -0.02,
  );

  const outerMembrane = new THREE.Mesh(
    new THREE.TubeGeometry(
      outerMembraneCurve,
      96,
      0.035,
      10,
      true,
    ),
    new THREE.MeshBasicMaterial({
      color: 0xe0c5ff,
      transparent: true,
      opacity: 0.9,
      depthTest: false,
    }),
  );

  outerMembrane.scale.set(0.78, 1.08, 0.88);
  outerMembrane.renderOrder = 11;
  nucleusGroup.add(outerMembrane);




  const dnaGroup = new THREE.Group();
  dnaGroup.position.y = 0.12;
  dnaGroup.scale.setScalar(1.04);
  nucleusGroup.add(dnaGroup);

  const strandCurves = [createHelixCurve(0), createHelixCurve(Math.PI)];

  const strandMaterials = [
    createMaterial(0x39c8f5, {
      roughness: 0.38,
      metalness: 0.03,
    }),
    createMaterial(0x2aa1d8, {
      roughness: 0.38,
      metalness: 0.03,
    }),
  ];

  strandCurves.forEach((curve, index) => {
    const strand = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 180, 0.145, 14, false),
      strandMaterials[index],
    );
    strand.castShadow = true;
    strand.receiveShadow = true;
    dnaGroup.add(strand);
  });

  const geneStart = 0.34;
  const geneEnd = 0.67;
  const geneMaterials = [
    createMaterial(0xffad38, {
      emissive: 0x8a3f12,
      emissiveIntensity: 0.34,
      roughness: 0.3,
    }),
    createMaterial(0xffd15b, {
      emissive: 0x8a3f12,
      emissiveIntensity: 0.3,
      roughness: 0.3,
    }),
  ];

  strandCurves.forEach((_, index) => {
    const geneCurve = createHelixCurve(index * Math.PI, geneStart, geneEnd);
    const geneStrand = new THREE.Mesh(
      new THREE.TubeGeometry(geneCurve, 70, 0.19, 14, false),
      geneMaterials[index],
    );
    geneStrand.castShadow = true;
    geneStrand.receiveShadow = true;
    dnaGroup.add(geneStrand);
  });

  const geneRungs = [];
  const rungCount = 18;

  for (let index = 0; index < rungCount; index += 1) {
    const t = (index + 0.5) / rungCount;
    const pointA = strandCurves[0].getPoint(t);
    const pointB = strandCurves[1].getPoint(t);
    const midpoint = pointA.clone().add(pointB).multiplyScalar(0.5);
    const colors = pairColors[index % pairColors.length];
    const inGene = index >= 6 && index <= 11;
    const rungGroup = new THREE.Group();

    const firstMaterial = inGene
      ? geneMaterials[0]
      : createMaterial(colors[0], { roughness: 0.42 });
    const secondMaterial = inGene
      ? geneMaterials[1]
      : createMaterial(colors[1], { roughness: 0.42 });

    rungGroup.add(createBeam(pointA, midpoint, 0.1, firstMaterial));
    rungGroup.add(createBeam(midpoint, pointB, 0.1, secondMaterial));
    rungGroup.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(inGene ? 0.13 : 0.11, 12, 8),
        inGene
          ? geneMaterials[0]
          : createMaterial(colors[0], { roughness: 0.42 }),
      ),
    );
    rungGroup.children.at(-1).position.copy(midpoint);
    dnaGroup.add(rungGroup);

    if (inGene) {
      geneRungs.push(rungGroup);
    }
  }

  setShadowState(dnaGroup);

  const annotations = {
    dna: document.querySelector(".dna-annotation"),
    nucleus: document.querySelector(".nucleus-annotation"),
    gene: document.querySelector(".gene-annotation"),
    dnaLine: document.querySelector(".dna-annotation-line"),
    nucleusLine: document.querySelector(".nucleus-annotation-line"),
    geneLine: document.querySelector(".gene-annotation-line"),
  };

  const animationStart = performance.now();

  function resize() {
    const width = sceneRoot.clientWidth || window.innerWidth;
    const height = sceneRoot.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function updateAnnotations(width, height) {
    const dnaAnchor = projectPoint(
      strandCurves[1].getPoint(0.16),
      dnaGroup,
      camera,
      width,
      height,
    );
    const geneAnchor = projectPoint(
      strandCurves[1].getPoint(0.5),
      dnaGroup,
      camera,
      width,
      height,
    );
    const nucleusAnchor = projectPoint(
      new THREE.Vector3(3.05, 2.1, 0.2),
      nucleusGroup,
      camera,
      width,
      height,
    );

    const dnaLabel = placeLabel(annotations.dna, dnaAnchor, -112, -30);
    const nucleusLabel = placeLabel(
      annotations.nucleus,
      nucleusAnchor,
      24,
      -20,
    );
    const geneLabel = placeLabel(annotations.gene, geneAnchor, 112, -12);

    placeLine(
      annotations.dnaLine,
      { x: dnaLabel.x + 34, y: dnaLabel.y + 11 },
      dnaAnchor,
    );
    placeLine(
      annotations.nucleusLine,
      { x: nucleusLabel.x - 8, y: nucleusLabel.y + 11 },
      nucleusAnchor,
    );
    placeLine(
      annotations.geneLine,
      { x: geneLabel.x - 8, y: geneLabel.y + 11 },
      geneAnchor,
    );
  }

  function render() {
    const now = performance.now();
    const elapsed = (now - animationStart) / 1000;
    const introProgress = Math.min((now - animationStart) / 7000, 1);
    const easedIntro = 1 - (1 - introProgress) ** 3;
    const width = sceneRoot.clientWidth || window.innerWidth;
    const height = sceneRoot.clientHeight || window.innerHeight;
    const isPortrait = width / height < 0.8;
    camera.position.z = isPortrait
      ? 27.5 - easedIntro * 3.2
      : 25.5 - easedIntro * 3;
    camera.position.y = 0.2 + Math.sin(elapsed * 0.18) * 0.04;
    camera.lookAt(0, 0, 0);

    dnaGroup.rotation.y = elapsed * 0.12;
    dnaGroup.rotation.x = Math.sin(elapsed * 0.24) * 0.025;
    nucleusGroup.rotation.y = Math.sin(elapsed * 0.16) * 0.025;
    cellGroup.rotation.y = Math.sin(elapsed * 0.1) * 0.018;

    geneRungs.forEach((rung, index) => {
      const glow = 1 + Math.sin(elapsed * 2.2 + index * 0.35) * 0.08;
      rung.scale.setScalar(glow);
    });

    updateAnnotations(width, height);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  resize();
  render();
}
