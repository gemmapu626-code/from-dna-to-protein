import * as THREE from "three";

export function initStepThreeScene() {
  const container = document.querySelector(".scene-three");

  if (!container) {
    console.warn("Scene 3 container not found.");
    return;
  }

  container.innerHTML = "";
  container.style.position = "relative";
  container.style.overflow = "hidden";

  // --------------------------------------------------
  // SCENE
  // --------------------------------------------------

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(
    35,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );

  camera.position.set(0, 0, 16);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = false;

  container.appendChild(renderer.domElement);

  // --------------------------------------------------
  // LIGHTING
  // --------------------------------------------------

  const hemisphereLight = new THREE.HemisphereLight(
    0xa7d8ff,
    0x160d46,
    1.4
  );

  scene.add(hemisphereLight);

  const mainLight = new THREE.DirectionalLight(
    0xffffff,
    2.5
  );

  mainLight.position.set(-5, 7, 10);
  scene.add(mainLight);

  const fillLight = new THREE.AmbientLight(
    0xffffff,
    0.7
  );

  scene.add(fillLight);

  // --------------------------------------------------
  // CELL
  // --------------------------------------------------

  const cellGroup = new THREE.Group();
  cellGroup.scale.set(1.35, 0.82, 0.75);
  scene.add(cellGroup);

  const cellGeometry = new THREE.SphereGeometry(5.4, 64, 48);

  const cellMaterial = new THREE.MeshPhongMaterial({
    color: 0x5daee0,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide,
    depthWrite: false,
    wireframe: false,
  });

  const cell = new THREE.Mesh(
    cellGeometry,
    cellMaterial
  );

  cellGroup.add(cell);

  // Soft outer rim.
  const cellRimMaterial = new THREE.MeshBasicMaterial({
    color: 0x63c8ff,
    transparent: true,
    opacity: 0.22,
    side: THREE.BackSide,
    wireframe: false,
  });

  const cellRim = new THREE.Mesh(
    new THREE.SphereGeometry(5.42, 64, 48),
    cellRimMaterial
  );

  cellGroup.add(cellRim);

  // --------------------------------------------------
  // NUCLEUS
  // --------------------------------------------------

  const nucleusGroup = new THREE.Group();

  nucleusGroup.position.set(-2.9, 0.25, 0.2);
  nucleusGroup.scale.set(1.35, 1.35, 1.1);

  scene.add(nucleusGroup);

  const nucleusGeometry = new THREE.SphereGeometry(
    2.45,
    48,
    36
  );

  const nucleusMaterial = new THREE.MeshPhongMaterial({
    color: 0x8d72d8,
    transparent: true,
    opacity: 0.72,
    side: THREE.DoubleSide,
    wireframe: false,
  });

  const nucleus = new THREE.Mesh(
    nucleusGeometry,
    nucleusMaterial
  );

  nucleusGroup.add(nucleus);

  // Nucleus outer membrane.
  const nucleusOutline = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 48, 36),
    new THREE.MeshBasicMaterial({
      color: 0xb59aff,
      transparent: true,
      opacity: 0.35,
      wireframe: false,
      side: THREE.BackSide,
    })
  );

  nucleusGroup.add(nucleusOutline);

  // --------------------------------------------------
  // NUCLEAR PORE
  // --------------------------------------------------

  const poreGroup = new THREE.Group();

  poreGroup.position.set(
    2.4,
    0.30,
    0.15
  );

  nucleusGroup.add(poreGroup);

  const poreRing = new THREE.Mesh(
  new THREE.TorusGeometry(
    0.40,
    0.12,
    20,
    40
  ),
    
    new THREE.MeshPhongMaterial({
      color: 0xb49aff,
      transparent: true,
      opacity: 0.95,
    })
  );

  poreRing.rotation.y = Math.PI / 2;
  poreGroup.add(poreRing);

  const poreCenter = new THREE.Mesh(
    new THREE.SphereGeometry(0.29, 32, 24),
    new THREE.MeshPhongMaterial({
      color: 0x4b377e,
      transparent: true,
      opacity: 0.8,
    })
  );

  poreGroup.add(poreCenter);

  // --------------------------------------------------
  // mRNA
  // --------------------------------------------------

  const mrnaGroup = new THREE.Group();
  scene.add(mrnaGroup);

  const mrnaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-4.25, 0.85, 0.35),
    new THREE.Vector3(-3.45, 0.82, 0.35),
    new THREE.Vector3(-2.6, 0.78, 0.35),
    new THREE.Vector3(-1.7, 0.75, 0.35),
    new THREE.Vector3(-0.8, 0.70, 0.45),
    new THREE.Vector3(0.1, 0.72, 0.5),
    new THREE.Vector3(1.05, 0.78, 0.55),
    new THREE.Vector3(2.4, 0.82, 0.5),
  ]);

  const mrnaGeometry = new THREE.TubeGeometry(
    mrnaCurve,
    100,
    0.075,
    16,
    false
  );

  const mrnaMaterial = new THREE.MeshPhongMaterial({
    color: 0xffc21a,
    emissive: 0xff9d00,
    emissiveIntensity: 1.7,
  });

  const mrna = new THREE.Mesh(
    mrnaGeometry,
    mrnaMaterial
  );

  mrnaGroup.add(mrna);

  // Small bases attached to mRNA.
  const baseMaterial = new THREE.MeshPhongMaterial({
    color: 0xffc21a,
    emissive: 0xff9d00,
    emissiveIntensity: 1.7,
  });

  for (let i = 0; i < 20; i++) {
    const t = 0.08 + i * 0.047;

    const point = mrnaCurve.getPoint(t);
    const tangent = mrnaCurve.getTangent(t);

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.28, 0.07),
      baseMaterial
    );

    // Put each base on one side of the mRNA.
    const side = new THREE.Vector3(
      -tangent.y,
      tangent.x,
      0
    ).normalize();

    base.position.copy(point);
    base.position.add(side.multiplyScalar(0.16));

    // Make the base perpendicular to the mRNA.
    base.rotation.z = Math.atan2(tangent.y, tangent.x);

    mrnaGroup.add(base);
  }

  // --------------------------------------------------
  // RIBOSOME
  // --------------------------------------------------

  const ribosomeGroup = new THREE.Group();

  ribosomeGroup.position.set(
    3.15,
    0.75,
     0.15
  );

  ribosomeGroup.scale.set(
    1.15,
    1.15,
    1.15
  );

  scene.add(ribosomeGroup);

  const ribosomeMaterial = new THREE.MeshPhongMaterial({
    color: 0x73d59b,
    transparent: false,
    wireframe: false,
  });

  const ribosomeTop = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.82,
      40,
      28
    ),
    ribosomeMaterial
  );

  ribosomeTop.scale.set(
    1.35,
    0.65,
    1
  );

  ribosomeTop.position.y = 0.48;

  ribosomeGroup.add(ribosomeTop);

  const ribosomeBottom = new THREE.Mesh(
    new THREE.SphereGeometry(
      0.92,
      40,
      28
    ),
    ribosomeMaterial
  );

  ribosomeBottom.scale.set(
    1.25,
    0.65,
    1
  );

  ribosomeBottom.position.y = -0.45;

  ribosomeGroup.add(ribosomeBottom);

  // --------------------------------------------------
  // LABELS
  // --------------------------------------------------

  function createLabel(
    text,
    className,
    position
  ) {
    const label = document.createElement("div");

    label.textContent = text;
    label.className = `scene-three-label ${className}`;

    label.style.position = "absolute";
    label.style.pointerEvents = "none";
    label.style.color = "#ffffff";
    label.style.fontFamily =
      "Arial, Helvetica, sans-serif";
    label.style.fontSize = "22px";
    label.style.fontWeight = "700";
    label.style.whiteSpace = "nowrap";
    label.style.textShadow =
      "0 2px 6px rgba(0,0,0,0.45)";
    label.style.zIndex = "50";

    container.appendChild(label);

    return {
      element: label,
      position,
    };
  }

  const nucleusLabel = createLabel(
    "Nucleus",
    "nucleus-label",
    new THREE.Vector3(-2.8, 2.8, 1)
  );

  const poreLabel = createLabel(
    "Nuclear pore",
    "pore-label",
    new THREE.Vector3(0.0, 2.0, 1)
  );

  const mrnaLabel = createLabel(
    "mRNA",
    "mrna-label",
    new THREE.Vector3(1.5, 1.6, 1)
  );
  mrnaLabel.element.style.color = "#ffc21a";

  const ribosomeLabel = createLabel(
    "Ribosome",
    "ribosome-label",
    new THREE.Vector3(3.4, -1.8, 1)
  );

  // --------------------------------------------------
  // LABEL LINES
  // --------------------------------------------------

  function createLine(className) {
    const line = document.createElement("div");

    line.className = `scene-three-label-line ${className}`;

    line.style.position = "absolute";
    line.style.height = "2px";
    line.style.backgroundColor = "#ffffff";
    line.style.transformOrigin = "left center";
    line.style.pointerEvents = "none";
    line.style.zIndex = "9";

    container.appendChild(line);

    return line;
  }

  const nucleusLine = createLine("nucleus-line");
  const poreLine = createLine("pore-line");
  const mrnaLine = createLine("mrna-line");
  const ribosomeLine = createLine("ribosome-line");

  function projectPoint(worldPosition) {
    const projected =
      worldPosition.clone().project(camera);

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
  // FIND CLOSEST VISIBLE POINTS ON OBJECTS
  // --------------------------------------------------

  function getClosestMrnaPoint(label) {
    let closestPoint = new THREE.Vector3();
    let closestDistance = Infinity;

    const labelPoint = projectPoint(label.position);

    for (let i = 0; i <= 100; i++) {
      const t = i / 100;

      // Get the mRNA point in local coordinates.
      const localPoint = mrnaCurve.getPoint(t).clone();

      // Convert it to world coordinates only for projection.
      const worldPoint = localPoint.clone();
      mrnaGroup.localToWorld(worldPoint);

      const projected = projectPoint(worldPoint);

      const dx = projected.x - labelPoint.x;
      const dy = projected.y - labelPoint.y;

      const distance = dx * dx + dy * dy;

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = worldPoint.clone();
      }
    }

    return closestPoint;
  }

  function getClosestRibosomePoint(label) {
    const candidates = [];

    const parts = [
      {
        y: 0.48,
        radius: 0.82,
        scaleX: 1.35,
        scaleY: 0.65,
      },
      {
        y: -0.45,
        radius: 0.92,
        scaleX: 1.25,
        scaleY: 0.65,
      },
    ];

    for (const part of parts) {
      for (let i = 0; i < 32; i++) {
        const angle =
          (i / 32) * Math.PI * 2;

        const point =
          new THREE.Vector3(
            Math.cos(angle) *
              part.radius *
              part.scaleX,

            part.y +
              Math.sin(angle) *
              part.radius *
              part.scaleY,

            0
          );

        ribosomeGroup.localToWorld(point);

        candidates.push(point);
      }
    }

    const labelPoint =
      projectPoint(label.position);

    let closestPoint =
      candidates[0];

    let closestDistance =
      Infinity;

    for (const point of candidates) {
      const projected =
        projectPoint(point);

      const dx =
        projected.x - labelPoint.x;

      const dy =
        projected.y - labelPoint.y;

      const distance =
        dx * dx + dy * dy;

      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = point.clone();
      }
    }

    return closestPoint;
  }
  
  
  function updateLine(
    line,
    label,
    anchor,
    lineColor = "#ffffff"
  ) {
    const labelPoint = projectPoint(label.position);
    const anchorPoint = projectPoint(anchor);

    // Position the label.
    label.element.style.left = `${labelPoint.x}px`;
    label.element.style.top = `${labelPoint.y}px`;
    label.element.style.transform = "translate(-50%, -50%)";

    // --------------------------------------------------
    // Start the line at the closest edge of the label,
    // rather than from the center of the text.
    // --------------------------------------------------

    const labelRect = label.element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const labelLeft =
      labelRect.left - containerRect.left;

    const labelRight =
      labelRect.right - containerRect.left;

    const labelTop =
      labelRect.top - containerRect.top;

    const labelBottom =
      labelRect.bottom - containerRect.top;

    const labelCenterX =
      (labelLeft + labelRight) / 2;

    const labelCenterY =
      (labelTop + labelBottom) / 2;

    const dxToObject =
      anchorPoint.x - labelCenterX;

    const dyToObject =
      anchorPoint.y - labelCenterY;

    let startX = labelCenterX;
    let startY = labelCenterY;

    // Choose the closest edge of the label.
    if (Math.abs(dxToObject) > Math.abs(dyToObject)) {
      if (dxToObject > 0) {
        startX = labelRight;
      } else {
        startX = labelLeft;
      }
    } else {
      if (dyToObject > 0) {
        startY = labelBottom;
      } else {
        startY = labelTop;
      }
    }

    // --------------------------------------------------
    // Draw the line from the label edge to the object.
    // --------------------------------------------------

    const dx =
      anchorPoint.x - startX;

    const dy =
      anchorPoint.y - startY;

    const length =
      Math.sqrt(dx * dx + dy * dy);

    const angle =
      Math.atan2(dy, dx);

    line.style.left = `${startX}px`;
    line.style.top = `${startY}px`;
    line.style.width = `${length}px`;
    line.style.height = "2px";
    line.style.backgroundColor = lineColor;
    line.style.transformOrigin = "left center";
    line.style.transform = `rotate(${angle}rad)`;
  }

  // --------------------------------------------------
  // RESIZE
  // --------------------------------------------------

  function resize() {
    const width =
      container.clientWidth;

    const height =
      container.clientHeight;

    if (!width || !height) return;

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height
    );

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, 2)
    );
  }

  const resizeObserver =
    new ResizeObserver(resize);

  resizeObserver.observe(container);

  resize();

  // --------------------------------------------------
  // ANIMATION
  // --------------------------------------------------

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Gentle left-to-right movement of the mRNA.
    mrnaGroup.position.x =
      Math.sin(time * 0.9) * 0.10;
    
    // Move the mRNA label with the mRNA.
    mrnaLabel.position.x =
      1.5 + mrnaGroup.position.x;

    // Very subtle ribosome movement.
    ribosomeGroup.rotation.z =
      Math.sin(time * 0.7) * 0.025;

    // Keep labels positioned.
    const nucleusAnchor =
      nucleusGroup.localToWorld(
        new THREE.Vector3(0, 1.35, 0)
      );

    updateLine(
      nucleusLine,
      nucleusLabel,
      nucleusAnchor
    );

    const poreAnchor =
      getClosestPorePoint(poreLabel);

    updateLine(
      poreLine,
      poreLabel,
      poreAnchor
    );

    const mrnaAnchor =
      getClosestMrnaPoint(mrnaLabel);
    

    updateLine(
      mrnaLine,
      mrnaLabel,
      mrnaAnchor,
      "#ffc21a"
    );
    

    const ribosomeAnchor =
      getClosestRibosomePoint(ribosomeLabel);

    updateLine(
      ribosomeLine,
      ribosomeLabel,
      ribosomeAnchor
    );

    

    function getClosestPorePoint(label) {
      const candidates = [];

      const radius = 0.52;

      for (let i = 0; i < 32; i++) {
        const angle =
          (i / 32) * Math.PI * 2;

        const point = new THREE.Vector3(
          0,
          Math.cos(angle) * radius,
          Math.sin(angle) * radius
        );

        poreGroup.localToWorld(point);
        candidates.push(point);
      }

      const labelPoint =
        projectPoint(label.position);

      let closestPoint =
        candidates[0];

      let closestDistance =
        Infinity;

      for (const point of candidates) {
        const projected =
          projectPoint(point);

        const dx =
          projected.x - labelPoint.x;

        const dy =
          projected.y - labelPoint.y;

        const distance =
          dx * dx + dy * dy;

        if (distance < closestDistance) {
          closestDistance = distance;
          closestPoint = point.clone();
        }
      }

      return closestPoint;
    }

    

    renderer.render(
      scene,
      camera
    );
  }

  animate();
}