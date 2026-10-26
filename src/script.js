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
      "DNA contains the genetic instructions that cells use to function and produce proteins. A gene is a segment of DNA that contains instructions for making a functional product, such as a protein or RNA molecule. ",
  },
  {
    number: "2",
    lessonNumber: "02",
    title: "TRANSCRIPTION",
    description:
      "During transcription, RNA polymerase uses one DNA strand, called the template strand, to build a complementary mRNA strand. RNA polymerase reads the template strand in the 3′ to 5′ direction and builds the mRNA strand in the 5′ to 3′ direction, using uracil (U) instead of thymine (T).",
  },
  {
    number: "3",
    lessonNumber: "03",
    title: "mRNA LEAVES THE NUCLEUS",
    description:
      "In eukaryotic cells, pre-mRNA is processed by adding a 5′ cap and a poly-A tail, removing introns, and joining exons to produce mature mRNA. The mature mRNA exits the nucleus through a nuclear pore and travels to a ribosome in the cytoplasm for translation.",
  },
  {
    number: "4",
    lessonNumber: "04",
    title: "TRANSLATION",
    description:
      "",
  },
  {
    number: "5",
    lessonNumber: "05",
    title: "PROTEIN",
    description:
      "The amino-acid chain folds into a functional protein.",
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

