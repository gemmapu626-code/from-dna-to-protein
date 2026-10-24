import * as THREE from "three";

export function initStepFourScene() {
  const container = document.querySelector(".scene-four");

  if (!container) {
    console.warn("Scene 4 container not found.");
    return;
  }

  container.innerHTML = "";
  const description = document.createElement("div");

  description.className = "scene-four-description";

  description.textContent =
    "During translation, the ribosome reads mRNA and joins amino acids together to build a protein.";

  container.appendChild(description);
  
  container.style.position = "relative";
  container.style.overflow = "hidden";

  // --------------------------------------------------
  // SCENE
  // --------------------------------------------------

  const scene = new THREE.Scene();

  // Transparent so Scene 4 uses the CSS background.
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 0, 15);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
  );

  renderer.setSize(
    container.clientWidth,
    container.clientHeight
  );

  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = false;

  container.appendChild(renderer.domElement);

  // --------------------------------------------------
  // LIGHTING
  // --------------------------------------------------

  const hemisphereLight =
    new THREE.HemisphereLight(
      0xa7d8ff,
      0x160d46,
      1.4
    );

  scene.add(hemisphereLight);

  const mainLight =
    new THREE.DirectionalLight(
      0xffffff,
      2.5
    );

  mainLight.position.set(-5, 7, 10);
  scene.add(mainLight);

  const fillLight =
    new THREE.AmbientLight(
      0xffffff,
      0.7
    );

  scene.add(fillLight);

  // --------------------------------------------------
  // mRNA
  // --------------------------------------------------

  const mrnaGroup = new THREE.Group();
  mrnaGroup.position.x = -0.3;
  mrnaGroup.position.z = 0.45;
  scene.add(mrnaGroup);

  const mrnaCurve =
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.2, 0.15, 0.4),
      new THREE.Vector3(-4.0, 0.15, 0.4),
      new THREE.Vector3(-2.8, 0.15, 0.4),
      new THREE.Vector3(-1.6, 0.15, 0.4),
      new THREE.Vector3(-0.4, 0.15, 0.4),
      new THREE.Vector3(0.8, 0.15, 0.4),
      new THREE.Vector3(2.0, 0.15, 0.4),
      new THREE.Vector3(3.2, 0.15, 0.4),
      new THREE.Vector3(4.4, 0.15, 0.4),
    ]);

  const mrnaGeometry =
    new THREE.TubeGeometry(
      mrnaCurve,
      110,
      0.075,
      16,
      false
    );

  const mrnaMaterial =
    new THREE.MeshPhongMaterial({
      color: 0xffc21a,
      emissive: 0xff9d00,
      emissiveIntensity: 1.7,
    });

  const mrna =
    new THREE.Mesh(
      mrnaGeometry,
      mrnaMaterial
    );

  mrnaGroup.add(mrna);

  // --------------------------------------------------
  // mRNA BASES
  // --------------------------------------------------

  const baseMaterial =
    new THREE.MeshPhongMaterial({
      color: 0xffc21a,
      emissive: 0xff9d00,
      emissiveIntensity: 1.7,
    });

  for (let i = 0; i < 25; i++) {
    const t =
      0.035 + i * 0.038;

    const point =
      mrnaCurve.getPoint(t);

    const base =
      new THREE.Mesh(
        new THREE.BoxGeometry(
          0.07,
          0.34,
          0.07
        ),
        baseMaterial
      );

    base.position.copy(point);

    // Upright bases, like the generated image.
    base.position.y += 0.18;

    mrnaGroup.add(base);
  }

  // --------------------------------------------------
  // RIBOSOME
  // --------------------------------------------------

  const ribosomeGroup =
    new THREE.Group();

  ribosomeGroup.position.set(
    1.25,
    0.05,
    -0.45
  );

  scene.add(ribosomeGroup);

  const ribosomeMaterial =
    new THREE.MeshPhongMaterial({
      color: 0x73d59b,
      transparent: false,
      wireframe: false,
    });

  // Top subunit
  const ribosomeTop =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        1.3,
        48,
        32
      ),
      ribosomeMaterial
    );

  ribosomeTop.scale.set(
    2.4,
    1,
    1
  );

  ribosomeTop.position.y =
    0.8;

  ribosomeGroup.add(
    ribosomeTop
  );

  // Bottom subunit
  const ribosomeBottom =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        1.5,
        48,
        32
      ),
      ribosomeMaterial
    );

  ribosomeBottom.scale.set(
    1.75,
    0.78,
    1
  );

  ribosomeBottom.position.y =
    -0.55;

  ribosomeGroup.add(
    ribosomeBottom
  );

  // --------------------------------------------------
  // AMINO ACID MATERIAL
  // --------------------------------------------------

  const aminoAcidMaterial =
    new THREE.MeshPhongMaterial({
      color: 0xff9d5c,
      emissive: 0xff6f32,
      emissiveIntensity: 0.5,
    });

  // --------------------------------------------------
  // GROWING AMINO-ACID CHAIN
  // --------------------------------------------------

  const chainGroup =
    new THREE.Group();

  scene.add(chainGroup);

  const chainPositions = [
    new THREE.Vector3(
      2.65,
      2.30,
      1.05
    ),

    new THREE.Vector3(
      3.15,
      2.70,
      1.05
    ),

    new THREE.Vector3(
      2.80,
      3.10,
      1.05
    ),

    new THREE.Vector3(
      3.35,
      3.50,
      1.05
    ),

    new THREE.Vector3(
      3.00,
      3.90,
      1.05
    ),
  ];

  const chainAcids = [];

  for (
    let i = 0;
    i < chainPositions.length;
    i++
  ) {
    const acid =
      new THREE.Mesh(
        new THREE.SphereGeometry(
          0.27,
          24,
          18
        ),
        aminoAcidMaterial
      );

    acid.position.copy(
      chainPositions[i]
    );

    chainGroup.add(acid);
    chainAcids.push(acid);

    if (i > 0) {
      const start =
        chainPositions[i - 1];

      const end =
        chainPositions[i];

      const direction =
        new THREE.Vector3()
          .subVectors(end, start);

      const length =
        direction.length();

      const connector =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.055,
            0.055,
            length,
            15
          ),
          aminoAcidMaterial
        );

      connector.position
        .copy(start)
        .add(
          direction
            .clone()
            .multiplyScalar(0.5)
        );

      connector.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize()
      );

      chainGroup.add(
        connector
      );
    }
  }

  // Connect pink tRNA amino acid to the growing chain
  const pinkAminoAcidPosition =
    new THREE.Vector3(
      2.35,
      1.77,
      0.95
    );

  const chainStart =
    chainPositions[0];

  const connectionDirection =
    new THREE.Vector3()
      .subVectors(
        chainStart,
        pinkAminoAcidPosition
      );

  const connectionLength =
    connectionDirection.length();

  const pinkToChainConnector =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.035,
        0.035,
        connectionLength,
        10
      ),
      aminoAcidMaterial
    );

  pinkToChainConnector.position
    .copy(pinkAminoAcidPosition)
    .add(
      connectionDirection
        .clone()
        .multiplyScalar(0.5)
    );

  pinkToChainConnector.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    connectionDirection.normalize()
  );

  chainGroup.add(
    pinkToChainConnector
  );
  



  
  // tRNA
  // --------------------------------------------------

  const trnaGroups = [];

  const trnaColors = [
    0xb99cff,
    0x7ed8ff,
    0xffa5c8,
  ];

  const trnaPositions = [
    new THREE.Vector3(0.15, 0.95, 0.75),
    new THREE.Vector3(1.25, 1.15, 0.85),
    new THREE.Vector3(2.35, 0.95, 0.75),
  ];

  for (let i = 0; i < 3; i++) {

    const trnaGroup = new THREE.Group();

    trnaGroup.position.copy(trnaPositions[i]);
    trnaGroup.position.z = 0.95;

    scene.add(trnaGroup);

    const trnaMaterial = new THREE.MeshPhongMaterial({
      color: trnaColors[i],
      transparent: false,
    });

    // --------------------------------------------------
    // MAIN BODY
    // --------------------------------------------------

    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.15,
        0.75,
        8,
        16
      ),
      trnaMaterial
    );

    body.position.set(
      0,
      0.02,
      0
    );

    trnaGroup.add(body);


    // --------------------------------------------------
    // LEFT ARM — slightly different for each tRNA
    // --------------------------------------------------

    const leftArmLength = i === 0 ? 0.48 : i === 1 ? 0.42 : 0.52;

    const leftArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.11,
        leftArmLength,
        8,
        12
      ),
      trnaMaterial
    );

    leftArm.rotation.z =
      i === 0
        ? -Math.PI * 0.52
        : i === 1
        ? -Math.PI * 0.46
        : -Math.PI * 0.56;

    leftArm.position.set(
      -0.27,
      0.27,
      0
    );

    trnaGroup.add(leftArm);


    // --------------------------------------------------
    // RIGHT ARM — intentionally a little uneven
    // --------------------------------------------------

    const rightArmLength = i === 0 ? 0.40 : i === 1 ? 0.50 : 0.44;

    const rightArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.11,
        rightArmLength,
        8,
        12
      ),
      trnaMaterial
    );

    rightArm.rotation.z =
      i === 0
        ? Math.PI * 0.48
        : i === 1
        ? Math.PI * 0.57
        : Math.PI * 0.50;

    rightArm.position.set(
      0.27,
      0.25,
      0
    );

    trnaGroup.add(rightArm);


    // --------------------------------------------------
    // LEFT LOWER LEG
    // These form the two ends that pair with mRNA bases.
    // They overlap into the main body so they look connected.
    // --------------------------------------------------

    const leftLeg = new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.105,
        0.38,
        8,
        12
      ),
      trnaMaterial
    );

    leftLeg.rotation.z =
      -Math.PI * (0.08 + i * 0.015);

    leftLeg.position.set(
      -0.12,
      -0.47,
      0
    );

    trnaGroup.add(leftLeg);


    // --------------------------------------------------
    // RIGHT LOWER LEG
    // Slightly different angle so the tRNA isn't perfectly
    // symmetrical or mechanical.
    // --------------------------------------------------

    const rightLeg = new THREE.Mesh(
      new THREE.CapsuleGeometry(
        0.105,
        0.38,
        8,
        12
      ),
      trnaMaterial
    );

    rightLeg.rotation.z =
      Math.PI * (0.08 + i * 0.018);

    rightLeg.position.set(
      0.12,
      -0.47,
      0
    );

    trnaGroup.add(rightLeg);


    

    // --------------------------------------------------
    // AMINO ACID
    // --------------------------------------------------

    const aminoAcid = new THREE.Mesh(
      new THREE.SphereGeometry(
        0.27,
        24,
        18
      ),
      aminoAcidMaterial
    );

    aminoAcid.position.set(
      0,
      0.82,
      0
    );

    trnaGroup.add(aminoAcid);


    trnaGroups.push(trnaGroup);
  }

  // --------------------------------------------------
  // LABELS
  // --------------------------------------------------

  function createLabel(
    text,
    className,
    position,
    color = "#ffffff"
  ) {
    const label =
      document.createElement("div");

    label.textContent = text;

    label.className =
      `scene-four-label ${className}`;

    label.style.position =
      "absolute";

    label.style.pointerEvents =
      "none";

    label.style.color =
      color;

    label.style.fontFamily =
      "Arial, Helvetica, sans-serif";

    label.style.fontSize =
      "22px";

    label.style.fontWeight =
      "700";

    label.style.whiteSpace =
      "nowrap";

    label.style.textShadow =
      "0 2px 6px rgba(0,0,0,0.45)";

    label.style.zIndex =
      "50";

    container.appendChild(label);

    return {
      element: label,
      position,
    };
  }

  // mRNA label
  const mrnaLabel =
    createLabel(
      "mRNA",
      "mrna-label",
      new THREE.Vector3(
        -3.65,
        1.05,
        1
      ),
      "#ffc21a"
    );

  // Ribosome label
  const ribosomeLabel =
    createLabel(
      "Ribosome",
      "ribosome-label",
      new THREE.Vector3(
        1.25,
        -1.75,
        1
      )
    );

  // tRNA label
  const trnaLabel =
    createLabel(
      "tRNA",
      "trna-label",
      new THREE.Vector3(
        -2.15,
        -1.65,
        1
      )
    );

  // Amino acid label
  const aminoAcidLabel =
    createLabel(
      "Amino acid",
      "amino-acid-label",
      new THREE.Vector3(
        0.55,
        2.35,
        1
      )
    );

  // Growing amino-acid chain label
  const growingChainLabel =
    createLabel(
      "Growing amino-acid chain",
      "growing-chain-label",
      new THREE.Vector3(
        4.45,
        3.25,
        1
      )
    );

  // --------------------------------------------------
  // LABEL LINES
  // --------------------------------------------------

  function createLine(className) {
    const line = document.createElement("div");

    line.className =
      `scene-four-label-line ${className}`;

    line.style.position = "absolute";
    line.style.height = "2px";
    line.style.backgroundColor =
      className === "mrna-line"
        ? "#ffc21a"
        : "#ffffff";

    line.style.border = "none";
    line.style.borderRadius = "0";
    line.style.boxShadow = "none";
    line.style.transformOrigin = "left center";
    line.style.pointerEvents = "none";
    line.style.zIndex = "14";

    // Override conflicting CSS rules
    line.style.setProperty(
      "height",
      "2px",
      "important"
    );

    line.style.setProperty(
      "background",
      className === "mrna-line"
        ? "#ffc21a"
        : "#ffffff",
      "important"
    );

    line.style.setProperty(
      "border",
      "none",
      "important"
    );

    line.style.setProperty(
      "border-radius",
      "0",
      "important"
    );

    line.style.setProperty(
      "box-shadow",
      "none",
      "important"
    );

    container.appendChild(line);

    return line;
  }

  const mrnaLine =
    createLine("mrna-line");

  const ribosomeLine =
    createLine("ribosome-line");

  const trnaLine =
    createLine("trna-line");
  
  const aminoAcidLine =
    createLine("amino-acid-line");

  const growingChainLine =
    createLine("growing-chain-line");

  // --------------------------------------------------
  // PROJECTION
  // --------------------------------------------------

  function projectPoint(
    worldPosition
  ) {
    const projected =
      worldPosition
        .clone()
        .project(camera);

    return {
      x:
        (projected.x * 0.5 + 0.5) *
        container.clientWidth,

      y:
        (-projected.y * 0.5 + 0.5) *
        container.clientHeight,
    };
  }

  // --------------------------------------------------
  // LABEL LINE
  // --------------------------------------------------

  function updateLine(
    line,
    label,
    anchor,
    lineColor = "#ffffff"
  ) {
    const labelPoint =
      projectPoint(
        label.position
      );

    const anchorPoint =
      projectPoint(anchor);

    label.element.style.left =
      `${labelPoint.x}px`;

    label.element.style.top =
      `${labelPoint.y}px`;

    label.element.style.transform =
      "translate(-50%, -50%)";

    const labelRect =
      label.element
        .getBoundingClientRect();

    const containerRect =
      container
        .getBoundingClientRect();

    const left =
      labelRect.left -
      containerRect.left;

    const right =
      labelRect.right -
      containerRect.left;

    const top =
      labelRect.top -
      containerRect.top;

    const bottom =
      labelRect.bottom -
      containerRect.top;

    const centerX =
      (left + right) / 2;

    const centerY =
      (top + bottom) / 2;

    const dx =
      anchorPoint.x - centerX;

    const dy =
      anchorPoint.y - centerY;

    let startX =
      centerX;

    let startY =
      centerY;

    if (
      Math.abs(dx) >
      Math.abs(dy)
    ) {
      startX =
        dx > 0
          ? right
          : left;
    } else {
      startY =
        dy > 0
          ? bottom
          : top;
    }

    const finalDx =
      anchorPoint.x - startX;

    const finalDy =
      anchorPoint.y - startY;

    const length =
      Math.sqrt(
        finalDx * finalDx +
        finalDy * finalDy
      );

    const angle =
      Math.atan2(
        finalDy,
        finalDx
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
      "left center";

    line.style.transform =
      `rotate(${angle}rad)`;
  }








  
  // --------------------------------------------------
  // RESIZE
  // --------------------------------------------------

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
      height
    );

    renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        2
      )
    );
  }

  const resizeObserver =
    new ResizeObserver(
      resize
    );

  resizeObserver.observe(
    container
  );

  resize();

  // --------------------------------------------------
  // ANIMATION
  // --------------------------------------------------

  const clock =
    new THREE.Clock();

  function animate() {
    requestAnimationFrame(
      animate
    );

    const time =
      clock.getElapsedTime();

  

    // Ribosome gently moves.
    ribosomeGroup.rotation.z =
      Math.sin(time * 0.7) *
      0.018;

    // tRNAs gently move.
    trnaGroups.forEach(
      (trna, index) => {
        trna.position.y =
          trnaPositions[index].y +
          Math.sin(
            time * 1.2 +
            index * 1.4
          ) *
          0.06;
      }
    );

    // Amino-acid chain gently moves.
    chainGroup.rotation.z =
      Math.sin(time * 0.6) *
      0.025;

    // --------------------------------------------------
    // LABEL ANCHORS
    // --------------------------------------------------

    const mrnaAnchor =
      mrnaGroup.localToWorld(
        mrnaCurve
          .getPoint(0.28)
          .clone()
      );

    const ribosomeAnchor =
      ribosomeGroup.localToWorld(
        new THREE.Vector3(
          0,
          -0.35,
          0
        )
      );

    const trnaAnchor =
      trnaGroups[1].localToWorld(
        new THREE.Vector3(
          0,
          0.45,
          0
        )
      );
    
    // Amino acid on top of the purple tRNA
    const aminoAcidAnchor =
      trnaGroups[0].localToWorld(
        new THREE.Vector3(
          0,
          0.82,
          0
        )
      );

    // Growing chain anchor
    const growingChainAnchor =
      chainGroup.localToWorld(
        chainPositions[2].clone()
      );

    // --------------------------------------------------
    // UPDATE LABELS
    // --------------------------------------------------

    updateLine(
      mrnaLine,
      mrnaLabel,
      mrnaAnchor,
      "#ffc21a"
    );

    updateLine(
      ribosomeLine,
      ribosomeLabel,
      ribosomeAnchor
    );

    updateLine(
      trnaLine,
      trnaLabel,
      trnaAnchor
    );

    updateLine(
      aminoAcidLine,
      aminoAcidLabel,
      aminoAcidAnchor
    );

    updateLine(
      growingChainLine,
      growingChainLabel,
      growingChainAnchor
    );

    renderer.render(
      scene,
      camera
    );
  }

  animate();
}