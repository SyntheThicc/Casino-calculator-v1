const inputFields = document.querySelectorAll('.novcanica');
const outputFields = document.querySelectorAll('.output');
const totalBtn = document.querySelector('.btn-total');
const clearBtn = document.querySelector('.btn-clear');
const targetInput = document.querySelector('.target-amount');
const totalOutput = document.querySelector('.total-amount');
const messageDisplay = document.querySelector('.message');

class CasinoCalculator {
  constructor() {
    this.billCount;
    this.target;
    window.addEventListener('load', this._getLocalStorage.bind(this));
    window.addEventListener('beforeunload', this._setLocalStorage.bind(this));
    document.addEventListener('keydown', this._clearInputsShortcut.bind(this));
    this._renderInputs();
    totalBtn.addEventListener('click', this._calculateInputs.bind(this));
    clearBtn.addEventListener('click', this._clearInputs);
  }

  _renderInputs() {
    inputFields.forEach((input, i) => {
      input.addEventListener('input', function (e) {
        let outputValue = input.value * parseInt(e.target.dataset.id);
        !outputValue
          ? (outputFields[i].textContent = '')
          : (outputFields[i].textContent = outputValue);
      });
    });
  }

  _calculateInputs() {
    let cashRegisterAmount;
    let targetAmount = Number(targetInput.value);
    let totalAmount = [...outputFields]
      .map((outputField) => Number(outputField.textContent))
      .filter((outputFieldValue) => !isNaN(outputFieldValue))
      .reduce((acc, curr) => acc + curr, 0);
    totalOutput.innerHTML =
      totalAmount === 0 ? '' : `<h3>${totalAmount}</h3> <span>RSD</span>`;
    if (targetAmount && totalAmount) {
      cashRegisterAmount = totalAmount - targetAmount;
      if (totalAmount === targetAmount) {
        this._displayMessage(`U kasi imate tačan iznos.`, '#00ffa0', 'visak');
      } else if (targetAmount > totalAmount) {
        this._displayMessage(
          `U kasi imate ${Math.abs(cashRegisterAmount)} dinara manje.`,
          'red',
          'manjak'
        );
      } else {
        this._displayMessage(
          `U kasi imate  ${cashRegisterAmount} dinara više.`,
          '#00ffa0',
          'visak'
        );
      }
    }
    if (totalAmount && !targetAmount) {
      totalOutput.classList.remove('visak', 'manjak');
      messageDisplay.textContent = '';
    }
    if (!totalAmount) {
      totalOutput.textContent = '';
      this._displayMessage('Vrednosti nisu unete', '#3efffc');
      setTimeout(function () {
        messageDisplay.textContent = '';
      }, 1200);
    }
  }

  _setLocalStorage() {
    this.billCount = [];
    this.target = targetInput.value;
    inputFields.forEach((inputField) => {
      if (!inputField.value || inputField.value === '0') {
        this.billCount.push('');
      } else {
        this.billCount.push(inputField.value);
      }
    });
    localStorage.setItem('values', JSON.stringify(this.billCount));
    localStorage.setItem('target', JSON.stringify(this.target));
  }

  _getLocalStorage() {
    this.billCount = JSON.parse(localStorage.getItem('values'));
    this.target = Number(JSON.parse(localStorage.getItem('target')));
    inputFields.forEach((inputField, i) => {
      inputField.value = this.billCount[i];
      inputField.dispatchEvent(new Event('input'));
    });
    !this.target ? (targetInput.value = '') : (targetInput.value = this.target);
    if (this.billCount.every((bill) => bill === '')) return;
    this._calculateInputs();
  }

  _displayMessage(msg, color, className) {
    messageDisplay.textContent = msg;
    messageDisplay.style.color = color;
    totalOutput.classList.remove('visak', 'manjak');
    totalOutput.classList.toggle(className);
  }

  _clearInputs() {
    inputFields.forEach((inputField) => {
      if (inputField.classList.contains('novcanica')) inputField.value = '';
    });
    outputFields.forEach((outputField) => {
      outputField.textContent = '';
    });
    totalOutput.textContent = '';
    messageDisplay.textContent = '';
    totalOutput.classList.remove('visak', 'manjak');
    messageDisplay.classList.remove('visak', 'manjak');
  }

  _clearInputsShortcut(e) {
    if (e.key === 'Enter') this._calculateInputs();
    if (e.key === 'Escape' || e.key === 'Delete') {
      this._clearInputs();
    }
  }
}
const calculatorApp = new CasinoCalculator();
