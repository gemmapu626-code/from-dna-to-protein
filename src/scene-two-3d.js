import * as THREE from "three";

export function initStepTwoScene() {
  const container = document.querySelector(".scene-two");

  if (!container) {
    console.warn("Step 2 scene container not found.");
    return;
  }

  container.innerHTML = "";

  // ==================================================
  // SCENE
  // ==================================================

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(
    35,
    1,
    0.1,
    100
  );

  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.outputColorSpace = THREE.SRGBColorSpace;

  //renderer.toneMapping = THREE.ACESFilmicToneMapping;
  //renderer.toneMappingExposure = 1.15;

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  renderer.shadowMap.enabled = false;

  container.appendChild(renderer.domElement);

  
  // ==================================================
  // LIGHTING
  // Matches Scene 1
  // ==================================================

  const hemisphereLight = new THREE.HemisphereLight(
    0xa7d8ff,
    0x160d46,
    1.5
  );

  scene.add(hemisphereLight);

  const keyLight = new THREE.DirectionalLight(
    0xffffff,
    3.0
  );

  keyLight.position.set(-6, 9, 10);

  // Shadows are disabled in this scene,
  // so this light only provides illumination.
  keyLight.castShadow = false;

  scene.add(keyLight);
  const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1
  );

  scene.add(ambientLight);


  

  // ==================================================
  // CELL
  // ==================================================

  const cellGroup = new THREE.Group();

  scene.add(cellGroup);

  const cellGeometry = new THREE.SphereGeometry(
    5.3,
    64,
    64
  );

  const cellMaterial =
    new THREE.MeshPhysicalMaterial({
      color:0x72b9e6,
      transparent: true,
      opacity: 0.10,
      roughness: 0.4,
      metalness: 0.0,
      clearcoat: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

  const cell = new THREE.Mesh(
    cellGeometry,
    cellMaterial
  );

  cell.scale.set(
    1.35,
    0.72,
    0.78
  );

  cellGroup.add(cell);
  cell.renderOrder = 0;

  const cellOutlinePoints = [];

  for (let i = 0; i <= 128; i++) {
    const angle =
      (i / 128) * Math.PI * 2;

    cellOutlinePoints.push(
      new THREE.Vector3(
        Math.cos(angle) * 5.31 * 1.35,
        Math.sin(angle) * 5.31 * 0.72,
        0
      )
    );
  }

  const cellOutlineGeometry =
    new THREE.BufferGeometry().setFromPoints(
      cellOutlinePoints
    );

  const cellOutlineMaterial =
    new THREE.LineBasicMaterial({
      color: 0x6f9bd1,
      transparent: true,
      opacity: 0.65,
    });

  const cellOutline = new THREE.Line(
    cellOutlineGeometry,
    cellOutlineMaterial
  );

  cellGroup.add(cellOutline);

  // ==================================================
  // NUCLEUS
  // ==================================================

  const nucleusGroup =
    new THREE.Group();

  nucleusGroup.position.set(
    -0.7,
    0.15,
    0.2
  );

  cellGroup.add(nucleusGroup);

  const nucleusGeometry =
    new THREE.SphereGeometry(
      3.6,
      64,
      64
    );
 




  const nucleusOutlinePoints = [];

  for (let i = 0; i <= 128; i++) {
    const angle =
      (i / 128) * Math.PI * 2;

    nucleusOutlinePoints.push(
      new THREE.Vector3(
        Math.cos(angle) * 3.63,
        Math.sin(angle) * 3.63,
        0
      )
    );
  }

  const nucleusOutlineGeometry =
    new THREE.BufferGeometry().setFromPoints(
      nucleusOutlinePoints
    );

  const nucleusOutlineCurve =
    new THREE.CatmullRomCurve3(
      nucleusOutlinePoints
    );

  const nucleusOutlineMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0xd8d2ff,
      transparent: true,
      opacity: 0.95,
      roughness: 0.45,
      metalness: 0,
    });

  const nucleusOutline =
    new THREE.Mesh(
      new THREE.TubeGeometry(
        nucleusOutlineCurve,
        128,
        0.02,
        10,
        false
      ),
      nucleusOutlineMaterial
    );

  nucleusGroup.add(
    nucleusOutline
  );

  const nucleusOutline2 =
    nucleusOutline.clone();

  nucleusOutline2.scale.set(
    1.035,
    1.035,
    1.035
  );

  nucleusGroup.add(
    nucleusOutline2
  );


  // ==================================================
  // DNA
  //
  // Same 3D DNA construction, but horizontal.
  // The middle opens for transcription.
  // ==================================================

  const dnaGroup =
    new THREE.Group();

  dnaGroup.position.set(
    0,
    0,
    0.15
  );

  dnaGroup.scale.set(
    0.72,
    0.72,
    0.72
  );

  nucleusGroup.add(
    dnaGroup
  );

  const dnaColor = 0x58c9ed;
  const baseColor = 0xb9edff;

  const dnaLength = 6.8;
  const dnaRadius = 0.85;
  const verticalScale = 0.68;
  const turns = 2.25;

  const openingStart = 0.36;
  const openingEnd = 0.58;

  // ==================================================
  // DNA MATERIALS
  // ==================================================

  const dnaMaterial =
    new THREE.MeshPhysicalMaterial({
      color: dnaColor,
      roughness: 0.38,
      metalness: 0.25,
      clearcoat: 0,
    });

  const rungMaterial =
    new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.35,
      metalness: 0,
    });

  // ==================================================
  // HORIZONTAL HELIX
  // ==================================================

  function createHelixPoints(
    phase,
    start = 0,
    end = 1
  ) {
    const points = [];

    const samples = Math.max(
      20,
      Math.ceil(
        (end - start) * 160
      )
    );

    for (
      let i = 0;
      i <= samples;
      i++
    ) {
      const t =
        start +
        ((end - start) * i) /
          samples;

      const angle =
        t * turns * Math.PI * 2 +
        phase;

      let radius = dnaRadius;

      if (
        t >= openingStart &&
        t <= openingEnd
      ) {
        const openingProgress =
          (t - openingStart) /
          (openingEnd - openingStart);

        const openingShape =
          Math.sin(
            openingProgress *
              Math.PI
          );

        radius =
          dnaRadius +
          openingShape * 0.95;
      }

      points.push(
        new THREE.Vector3(
          -dnaLength / 2 +
            t * dnaLength,

          radius *
            Math.cos(angle) *
            verticalScale,

          radius *
            Math.sin(angle)
        )
      );
    }

    return points;
  }

  // ==================================================
  // DNA BACKBONES
  // ==================================================

  const strandOnePoints =
    createHelixPoints(0);

  const strandTwoPoints =
    createHelixPoints(Math.PI);

  const strandOneCurve =
    new THREE.CatmullRomCurve3(
      strandOnePoints
    );

  const strandTwoCurve =
    new THREE.CatmullRomCurve3(
      strandTwoPoints
    );

  const strandOne =
    new THREE.Mesh(
      new THREE.TubeGeometry(
        strandOneCurve,
        180,
        0.07,
        14,
        false
      ),
      dnaMaterial
    );

  const strandTwo =
    new THREE.Mesh(
      new THREE.TubeGeometry(
        strandTwoCurve,
        180,
        0.07,
        14,
        false
      ),
      dnaMaterial
    );

  dnaGroup.add(
    strandOne
  );

  dnaGroup.add(
    strandTwo
  );

  // ==================================================
  // DNA BASE PAIRS
  //
  // Individual rungs connect the two strands.
  // No horizontal line through the DNA.
  // ==================================================

  function createBeam(
    start,
    end,
    radius,
    material
  ) {
    const direction =
      end.clone().sub(start);

    const beam =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          radius,
          radius,
          direction.length(),
          14
        ),
        material
      );

    beam.position
      .copy(start)
      .add(end)
      .multiplyScalar(0.5);

    beam.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

    return beam;
  }

  const basePairCount = 28;

  for (
    let i = 0;
    i < basePairCount;
    i++
  ) {
    const t =
      (i + 0.5) /
      basePairCount;

    if (
      t > openingStart &&
      t < openingEnd
    ) {
      continue;
    }

    const pointA =
      strandOneCurve.getPoint(t);

    const pointB =
      strandTwoCurve.getPoint(t);

    const rung =
      createBeam(
        pointA,
        pointB,
        0.035,
        rungMaterial
      );

    dnaGroup.add(rung);
  }

  // ==================================================
  // OPENING BASES
  //
  // Each exposed base is attached directly to its
  // DNA backbone and points inward toward the
  // transcription bubble.
  //
  // The two DNA strands do NOT connect.
  // ==================================================

  const openingBaseMaterial =
    new THREE.MeshPhysicalMaterial({
      color: baseColor,
      roughness: 0.35,
      metalness: 0,
    });

  const openingBaseCount = 7;

  for (
    let i = 0;
    i < openingBaseCount;
    i++
  ) {
    const t =
      openingStart +
      0.04 +
      (i / (openingBaseCount - 1)) *
        (
          openingEnd -
          openingStart -
          0.08
        );

    const pointA =
      strandOneCurve.getPoint(t);

    const pointB =
      strandTwoCurve.getPoint(t);

    // UPPER DNA STRAND

    const upperEnd =
      pointA.clone();

    upperEnd.y -= 0.42;

    const upperBase =
      createBeam(
        pointA,
        upperEnd,
        0.035,
        openingBaseMaterial
      );

    dnaGroup.add(
      upperBase
    );

    // LOWER DNA STRAND

    const lowerEnd =
      pointB.clone();

    lowerEnd.y += 0.42;

    const lowerBase =
      createBeam(
        pointB,
        lowerEnd,
        0.035,
        openingBaseMaterial
      );

    dnaGroup.add(
      lowerBase
    );
  }

  // ==================================================
  // RNA POLYMERASE
  //
  // Simple ball behind the DNA.
  // ==================================================

  const polymeraseGroup =
    new THREE.Group();

  polymeraseGroup.position.set(
    0,
    0,
    -3
  );

  const polymeraseMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0xcf8266,
      roughness: 0.85,
      metalness: 0,
      clearcoat: 0,
      clearcoatRoughness: 1,
    });

  const polymerase =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        1.5,
        48,
        48
      ),
      polymeraseMaterial
    );

  polymeraseGroup.add(
    polymerase
  );

  nucleusGroup.add(
    polymeraseGroup
  );

  // ==================================================
  // mRNA
  // ==================================================

  const mrnaGroup =
    new THREE.Group();

  mrnaGroup.position.set(
    0.35,
    -0.25,
    1.25
  );

  mrnaGroup.scale.set(
    0.72,
    0.72,
    0.72
  );

  nucleusGroup.add(
    mrnaGroup
  );

  const mrnaMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0xffc21a,
      roughness: 0.12,
      metalness: 0,
      emissive: 0xff9d00,
      emissiveIntensity: 2.5,
    });

  // ==================================================
  // mRNA PATH
  //
  // The mRNA follows the curved path through the
  // transcription bubble and then exits toward the right.
  // ==================================================

  const mrnaPairedPoints = [];

  const mrnaPath = [
    new THREE.Vector3(-0.90, -0.28, 0.8),
    new THREE.Vector3(-0.82, -0.08, 0.8),
    new THREE.Vector3(-0.62, 0.12, 0.8),
    new THREE.Vector3(-0.35, 0.22, 0.8),
    new THREE.Vector3(-0.05, 0.20, 0.8),
    new THREE.Vector3(0.22, 0.08, 0.8),
    new THREE.Vector3(0.40, -0.10, 0.8),
    new THREE.Vector3(0.60, -0.24, 0.8),
  ];

  for (let i = 0; i < mrnaPath.length; i++) {
    mrnaPairedPoints.push(
      mrnaPath[i].clone()
    );
  }

  const mrnaExitPoints = [
    new THREE.Vector3(0.78, -0.20, 0.8),
    new THREE.Vector3(0.96, -0.08, 0.8),
    new THREE.Vector3(1.12, 0.04, 0.8),
    new THREE.Vector3(1.28, 0.12, 0.8),
    new THREE.Vector3(1.42, 0.08, 0.8),
  ];

  const mrnaPoints = [
    ...mrnaPairedPoints,
    ...mrnaExitPoints,
  ];

  const mrnaCurve =
    new THREE.CatmullRomCurve3(
      mrnaPoints
    );

  const mrna =
    new THREE.Mesh(
      new THREE.TubeGeometry(
        mrnaCurve,
        100,
        0.05,
        12,
        false
      ),
      mrnaMaterial
    );

  mrnaGroup.add(
    mrna
  );

  // ==================================================
  // mRNA NUCLEOTIDES
  // ==================================================

  const mrnaBaseMaterial =
    new THREE.MeshPhysicalMaterial({
      color: 0xffd84a,
      roughness: 0.12,
      metalness: 0,
      emissive: 0xffa800,
      emissiveIntensity: 2.0,
    });

  const mrnaBaseCount = 9;

  for (
    let i = 0;
    i < mrnaBaseCount;
    i++
  ) {
    const progress =
      0.05 +
      (i / (mrnaBaseCount - 1)) *
        0.90;

    const point =
      mrnaCurve.getPoint(progress);

    const tangent =
      mrnaCurve
        .getTangent(progress)
        .normalize();

    const baseDirection =
      new THREE.Vector3(
        0,
        i < 4 ? -1 : 1,
        0
      );

    const baseLength = 0.22;

    const baseStart =
      point.clone();

    const baseEnd =
      point.clone().add(
        baseDirection.multiplyScalar(
          baseLength
        )
      );

    const base =
      createBeam(
        baseStart,
        baseEnd,
        0.025,
        mrnaBaseMaterial
      );

    mrnaGroup.add(base);
  }

  // ==================================================
  // LABELS
  // ==================================================

  function createLabel(
    text,
    position,
    color = "#ffffff"
  ) {
    const label =
      document.createElement("div");

    label.className =
      "scene-two-label";

    label.textContent =
      text;

    label.style.position =
      "absolute";

    label.style.color =
      color;

    label.style.fontFamily =
      "Arial, sans-serif";

    label.style.fontSize =
      "22px";

    label.style.fontWeight =
      "700";

    label.style.letterSpacing =
      "0.04em";

    label.style.textShadow =
      "0 2px 6px rgba(0, 0, 0, 0.45)";

    label.style.pointerEvents =
      "none";

    label.style.whiteSpace =
      "nowrap";

    container.appendChild(
      label
    );

    return {
      element: label,
      position,
    };
  }

  function createLabelLine(
    color = "#ffffff"
  ) {
    const line =
      document.createElement("div");

    line.className =
      "scene-two-label-line";

    line.style.position =
      "absolute";

    line.style.height =
      "2px";

    line.style.background =
      color;

    line.style.transformOrigin =
      "0 50%";

    line.style.pointerEvents =
      "none";

    line.style.opacity =
      "0.9";

    container.appendChild(
      line
    );

    return line;
  }

  const nucleusLabel =
    createLabel(
      "Nucleus",
      new THREE.Vector3(
        2.4,
        2.4,
        1.0
      ),
      "#ffffff"
    );

  const nucleusLine =
    createLabelLine(
      "#d8d2ff"
    );

  const polymeraseLabel =
    createLabel(
      "RNA Polymerase",
      new THREE.Vector3(
         0.3,
        1.25,
        1.8
      ),
      "#f2a65a"
    );

  const polymeraseLine =
    createLabelLine(
      "#f2a65a"
    );

  const mrnaLabel =
    createLabel(
      "mRNA",
      new THREE.Vector3(
         1.7,
        -0.65,
        1.0
      ),
      "#ffff00"
    );

  const mrnaLine =
    createLabelLine(
      "#ffff00"
    );

  const templateLabel =
    createLabel(
      "Template DNA",
      new THREE.Vector3(
        -1,
        -1.25,
        1.4
      ),
      "#b9edff"
    );

  const templateLine =
    createLabelLine(
      "#b9edff"
    );

  // ==================================================
  // RESIZE
  // ==================================================

  function resize() {
    const width =
      container.clientWidth;

    const height =
      container.clientHeight;

    if (!width || !height) {
      return;
    }

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height,
      false
    );
  }

  resize();

  const resizeObserver =
    new ResizeObserver(
      resize
    );

  resizeObserver.observe(
    container
  );



  // ==================================================
  // LABEL POSITIONING
  // ==================================================

  function projectWorldPoint(
    point
  ) {
    const projected =
      point.clone();

    projected.project(
      camera
    );

    return {
      x:
        (projected.x * 0.5 + 0.5) *
        renderer.domElement.clientWidth,

      y:
        (-projected.y * 0.5 + 0.5) *
        renderer.domElement.clientHeight,
    };
  }

  function updateLabel(
    labelData,
    line,
    anchorWorld,
    lineColor
  ) {
    const width =
      container.clientWidth;

    const height =
      container.clientHeight;

    // ------------------------------------------
    // PROJECT LABEL POSITION
    // ------------------------------------------

    const labelProjected =
      labelData.position.clone();

    labelProjected.project(camera);

    const labelX =
      (labelProjected.x * 0.5 + 0.5) *
      width;

    const labelY =
      (-labelProjected.y * 0.5 + 0.5) *
      height;

    labelData.element.style.left =
      `${labelX}px`;

    labelData.element.style.top =
      `${labelY}px`;

    labelData.element.style.transform =
      "translate(-50%, -50%)";

    // ------------------------------------------
    // PROJECT OBJECT POINT
    // ------------------------------------------

    const anchorProjected =
      anchorWorld.clone();

    anchorProjected.project(camera);

    const anchorX =
      (anchorProjected.x * 0.5 + 0.5) *
      width;

    const anchorY =
      (-anchorProjected.y * 0.5 + 0.5) *
      height;

    // ------------------------------------------
    // GET LABEL RECTANGLE
    // ------------------------------------------

    const labelRect =
      labelData.element.getBoundingClientRect();

    const containerRect =
      container.getBoundingClientRect();

    const left =
      labelRect.left -
      containerRect.left;

    const top =
      labelRect.top -
      containerRect.top;

    const right =
      left +
      labelRect.width;

    const bottom =
      top +
      labelRect.height;

    // ------------------------------------------
    // FIND CLOSEST POINT ON LABEL EDGE
    // ------------------------------------------

    const startX =
      Math.max(
        left,
        Math.min(anchorX, right)
      );

    const startY =
      Math.max(
        top,
        Math.min(anchorY, bottom)
      );

    // ------------------------------------------
    // LINE TO OBJECT
    // ------------------------------------------

    const dx =
      anchorX -
      startX;

    const dy =
      anchorY -
      startY;

    const length =
      Math.hypot(
        dx,
        dy
      );

    line.style.left =
      `${startX}px`;

    line.style.top =
      `${startY}px`;

    line.style.width =
      `${length}px`;

    line.style.height =
      "2px";

    line.style.backgroundColor =
      lineColor;

    line.style.transformOrigin =
      "0 50%";

    line.style.transform =
      `rotate(${Math.atan2(
        dy,
        dx
      )}rad)`;
  }

  // ==================================================
  // ANIMATION
  // ==================================================

  const clock =
    new THREE.Clock();

  function animate() {
    requestAnimationFrame(
      animate
    );

    const elapsed =
      clock.getElapsedTime();

    dnaGroup.rotation.y =
      Math.sin(
        elapsed * 0.25
      ) * 0.012;

    polymeraseGroup.position.x =
      Math.sin(
        elapsed * 0.55
      ) * 0.12;

    polymeraseGroup.position.y =
      Math.cos(
        elapsed * 0.55
      ) * 0.04;

    // Gentle mRNA movement from left to right and back.
    // Only moves horizontally.
    mrnaGroup.position.x =
      0.35 +
      Math.sin(
        elapsed * 0.7
      ) * 0.18;

    // Nucleus label → nucleus membrane
    const nucleusAnchor =
      new THREE.Vector3(
        2.55,
        1.65,
        0
      );

    nucleusGroup.localToWorld(
      nucleusAnchor
    );

    updateLabel(
      nucleusLabel,
      nucleusLine,
      nucleusAnchor,
      "#d8d2ff"
    );

    // RNA polymerase label → polymerase
    const polymeraseAnchor =
      new THREE.Vector3(
        0,
        1.45,
        0
      );

    polymeraseGroup.localToWorld(
      polymeraseAnchor
    );

    updateLabel(
      polymeraseLabel,
      polymeraseLine,
      polymeraseAnchor,
      "#f2a65a"
    );


    
    // mRNA label → moves with the actual mRNA
    const mrnaLabelPosition =
      new THREE.Vector3(
        1.9,
        -0.55,
        1.0
      );

    mrnaGroup.localToWorld(
      mrnaLabelPosition
    );

    mrnaLabel.position.copy(
      mrnaLabelPosition
    );

    // Actual mRNA point for the connecting line
    const mrnaAnchor =
      mrnaCurve
        .getPoint(0.78)
        .clone();

    mrnaGroup.localToWorld(
      mrnaAnchor
    );

    updateLabel(
      mrnaLabel,
      mrnaLine,
      mrnaAnchor,
      "#ffff00"
    );
  
  
      

    

    // Template DNA label → DNA strand
    const templateAnchor =
      strandTwoCurve
        .getPoint(0.48)
        .clone();

    dnaGroup.localToWorld(
      templateAnchor
    );

    updateLabel(
      templateLabel,
      templateLine,
      templateAnchor,
      "#b9edff"
    );
    
    renderer.render(
      scene,
      camera
    );
  }

  animate();
}