const form = document.querySelector(".calculator__form");
const inputForBilling = document.getElementById("bill");
const inputForPeopleNum = document.getElementById("people");
const outputForTipAmount = document.getElementById("tip-amount");
const outputForTotalAmount = document.getElementById("total-amount");
const resetButton = document.getElementById("reset-button");
const tipButtons = document.querySelectorAll(".calculator__tip-option");
const errorMessage = document.querySelector(".calculator__error-message");
const customTipInput = document.getElementById("custom-tip");

let tipRate = 0;
const Fixed = 2;
const initialOutput = "$0.00";

(outputForTipAmount.textContent = initialOutput),
  (outputForTotalAmount.textContent = initialOutput);

function validateBilling() {
  return !(parseFloat(inputForBilling.value) === 0);
}

function validatePeopleNum() {
  return (
    !(parseInt(inputForPeopleNum.value) === 0) &&
    !(inputForPeopleNum.value === "")
  );
}

function validateTipButtons() {
  return !!Array.from(tipButtons).filter((tipButton) =>
    tipButton.classList.contains("active")
  ).length;
}

function validateCustomTip() {
  return parseFloat(customTipInput.value);
}

function validate() {
  // buttonのどれかひとつがactiveである　&& billが0より大きい && numOfPeopleが0より大きい.
  const errors = {};
  if (!validateBilling()) {
    // throw new Error("Billing must be more than 0");
    errors["billing"] = "Billing must be more than 0";
  }

  if (!validatePeopleNum()) {
    // throw new Error("Number of people must be more than 0");
    errors["numOfPeople"] = "Can't be zero";
  }

  if (!(validateTipButtons() || validateCustomTip())) {
    // throw new Error("Exact one tip Button must be active");
    errors["tipButtons"] = "one tip button must be active";
  }
  // numOfPeopleが０の時はエラーメッセージを出す。
  // validateが通った場合のみupdateOutputする。

  return errors;
}

function resetInput() {
  inputForBilling.value = 0;
  inputForPeopleNum.value = 0;
}

function resetOutput() {
  outputForTipAmount.textContent = initialOutput;
  outputForTotalAmount.textContent = initialOutput;
}

function errorDisplayUpdate(errors) {
  const { numOfPeople } = errors;
  if (!numOfPeople) return;
  errorMessage.removeAttribute("hidden");
  errorMessage.textContent = numOfPeople;
  resetOutput();
}

function errorHideUpdate() {
  console.log("errorHideUpdate called");

  errorMessage.setAttribute("hidden", "");
}

function updateOutput(totalPrice, tipPerPerson) {
  const errors = validate();

  if (!(Object.keys(errors).length === 0)) {
    console.log("error display called");

    return errorDisplayUpdate(errors);
  }

  errorHideUpdate();
  outputForTipAmount.textContent = `\$${tipPerPerson}`;
  outputForTotalAmount.textContent = `\$${totalPrice}`;
  resetButtonToggle();
}

function outputExists() {
  return !(
    outputForTipAmount.textContent === initialOutput &&
    outputForTotalAmount.textContent === initialOutput
  );
}

function resetButtonToggle() {
  if (outputExists()) {
    resetButton.removeAttribute("disabled");
  } else {
    resetButton.setAttribute("disabled", "");
  }
}

function initializeTipButtons() {
  tipButtons.forEach((tipButton) => tipButton.classList.remove("active"));
}

function calculateTipPerPerson(price, numOfPeople) {
  return ((price * tipRate - price) / numOfPeople).toFixed(Fixed);
}

function calculateTotalPrice(price, numOfPeople) {
  console.log(price, tipRate);

  return ((price * tipRate) / numOfPeople).toFixed(Fixed);
}

function handleTipInput(ev) {
  initializeTipButtons();
  tipRate = parseFloat(ev.target.value) * 0.01 + 1;
  const price = parseFloat(inputForBilling.value);
  const numOfPeople = parseFloat(inputForPeopleNum.value);
  const totalPrice = calculateTotalPrice(price, numOfPeople);
  const tipPerPerson = calculateTipPerPerson(price, numOfPeople);
  updateOutput(totalPrice, tipPerPerson);
}

function handleTipClick(ev) {
  initializeCustomInput();
  tipButtons.forEach((tipButton) => tipButton.classList.remove("active"));
  ev.target.classList.add("active");
  tipRate = parseFloat(ev.target.textContent) * 0.01 + 1;
  const price = parseFloat(inputForBilling.value);
  const numOfPeople = parseFloat(inputForPeopleNum.value);
  const totalPrice = calculateTotalPrice(price, numOfPeople);
  const tipPerPerson = calculateTipPerPerson(price, numOfPeople);
  updateOutput(totalPrice, tipPerPerson);
}

tipButtons.forEach((tipButton) => {
  tipButton.addEventListener("click", handleTipClick);
});

customTipInput.addEventListener("change", handleTipInput);

inputForBilling.addEventListener("change", (ev) => {
  const price = parseFloat(inputForBilling.value);
  const numOfPeople = parseFloat(inputForPeopleNum.value);
  const totalPrice = calculateTotalPrice(price, numOfPeople);
  const tipPerPerson = calculateTipPerPerson(price, numOfPeople);
  updateOutput(totalPrice, tipPerPerson);
});

inputForPeopleNum.addEventListener("change", (ev) => {
  const price = parseFloat(inputForBilling.value);
  const numOfPeople = parseFloat(inputForPeopleNum.value);
  const totalPrice = calculateTotalPrice(price, numOfPeople);
  const tipPerPerson = calculateTipPerPerson(price, numOfPeople);
  updateOutput(totalPrice, tipPerPerson);
});

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
});

function initializeCustomInput() {
  customTipInput.value = "";
}

resetButton.addEventListener("click", (ev) => {
  resetInput();
  resetOutput();
  initializeTipButtons();
  initializeCustomInput();
  resetButtonToggle();
});
