import { initStepOneScene } from "./scene-one-3d.js";
import { initStepTwoScene } from "./scene-two-3d.js";
import { initStepThreeScene } from "./scene-three-3d.js";
import { initStepFourScene } from "./scene-four-3d.js";
import { initStepFiveScene } from "./scene-five-3d.js";
import { initStepSixScene } from "./scene-six-3d.js";
const steps = [
  {
    number: "1",
    lessonNumber: "01",
    title: "DNA",
    description:
      "Genes are segments of DNA that contain instructions for making proteins.",
  },
  {
    number: "2",
    lessonNumber: "02",
    title: "TRANSCRIPTION",
    description:
      "During transcription, RNA polymerase copies the gene into mRNA.",
  },
  {
    number: "3",
    lessonNumber: "03",
    title: "mRNA LEAVES THE NUCLEUS",
    description:
      "The mRNA carries the instructions from the nucleus to the ribosome.",
  },
  {
    number: "4",
    lessonNumber: "04",
    title: "TRANSLATION",
    description:
      "During translation, the ribosome reads the mRNA and builds an amino-acid chain.",
  },
  {
    number: "5",
    lessonNumber: "05",
    title: "PROTEIN",
    description:
      "The amino-acid chain folds into a functional protein.",
  },

  {
    number: "6",
    lessonNumber: "06",
    title: "PROTEIN FOLDING",
    description:
      "The amino-acid chains fold into a three-dimensional protein structure."
  },

];

let currentStep = 0;

const stepNumber = document.querySelector("#step-number");
const lessonNumber = document.querySelector("#lesson-number");
const stepTitle = document.querySelector("#step-title");
const stepDescription = document.querySelector("#step-description");
const progressLabel = document.querySelector("#progress-label");
const progressFill = document.querySelector("#progress-fill");
const nextButton = document.querySelector("#next-button");
const backButton = document.querySelector("#back-button");
const replayButton = document.querySelector("#replay-button");
const sceneElements = document.querySelectorAll(".visual-scene");

function showStep() {
  const step = steps[currentStep];

  stepNumber.textContent = step.number;
  lessonNumber.textContent = step.lessonNumber;
  stepTitle.textContent = step.title;
  stepDescription.textContent = step.description;

  progressLabel.textContent =
    `Step ${step.number} of ${steps.length}`;

  progressFill.style.width =
    `${((currentStep + 1) / steps.length) * 100}%`;

  backButton.disabled = currentStep === 0;
  nextButton.hidden = currentStep === steps.length - 1;
  replayButton.hidden = currentStep !== steps.length - 1;

  sceneElements.forEach((scene, index) => {
    scene.classList.remove("active");
    scene.setAttribute(
      "aria-hidden",
      String(index !== currentStep)
    );
  });

  const activeScene = sceneElements[currentStep];

  if (activeScene) {
    activeScene.classList.add("active");
  }
}

nextButton.addEventListener("click", () => {
  currentStep = Math.min(
    currentStep + 1,
    steps.length - 1
  );

  showStep();
});

backButton.addEventListener("click", () => {
  currentStep = Math.max(
    currentStep - 1,
    0
  );

  showStep();
});

replayButton.addEventListener("click", () => {
  currentStep = 0;
  showStep();
});

showStep();


try {
  initStepOneScene();
  initStepTwoScene();
  initStepThreeScene();
  initStepFourScene();
  initStepFiveScene();
  initStepSixScene();

  console.log("All six scenes initialized.");
} catch (error) {
  console.error("Scene initialization failed:", error);
}

