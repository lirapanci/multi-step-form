//BUTTONS
const previousButton = document.querySelector('#back')
const nextButton = document.querySelector('#next')
const submitButton = document.querySelector('#confirm')
const steps = document.querySelectorAll('.step')
const forms = document.querySelectorAll('.form')
const isEmpty = (str) => !str.trim().length
let currentStep = 0

function hideCurrentTab(){
    forms[currentStep].classList.add('hidden')
    steps[currentStep].classList.remove('active')
}

function showOtherTab (){
    forms[currentStep].classList.remove('hidden')
    steps[currentStep].classList.add('active')
}

// Validate first input on load
validateEntry()

function total (){
    const selectedPlan = parseInt(document.querySelector('.confirmation-price').innerText)
    let total = selectedPlan

    const selectedAddOns = document.querySelectorAll('.confirmation-add-ons-price')
    for (let i = 0; i < selectedAddOns.length; i++) {
        let checkedAddOns = parseInt(selectedAddOns[i].innerText) || 0
        total = total + checkedAddOns
    }

    // TOTAL
    let totalPrice = document.querySelector('.total-price')
    totalPrice.innerHTML = total

    let totalPeriod = document.querySelector('.total-period')
    let planPeriod = document.querySelector('.plan-duration')
    totalPeriod.innerHTML = planPeriod.innerHTML
}

// Next: Change UI relative to current step and account for button permissions
nextButton.addEventListener('click', (event) => {
    event.preventDefault()

    // Hide current tab
    hideCurrentTab()

    // Show next tab
    currentStep += 1
    showOtherTab()

    validateEntry()
    updateStatusDisplay()
})

// Previous: Change UI relative to current step and account for button permissions
previousButton.addEventListener('click', (event) => {
    event.preventDefault()

    // Hide current tab
    hideCurrentTab()

    // Show previous tab
    currentStep -= 1
    showOtherTab()

    nextButton.removeAttribute('disabled')
    updateStatusDisplay()
})

function updateStatusDisplay() {
    // If on the last step, hide the next button and show submit
    if (currentStep === steps.length - 1) {
        nextButton.classList.add('hidden')
        previousButton.classList.remove('hidden')
        submitButton.classList.remove('hidden')
        validateEntry()

        // If it's the first step hide the previous button
    } else if (currentStep == 0) {
        nextButton.classList.remove('hidden')
        previousButton.classList.add('hidden')
        submitButton.classList.add('hidden')
        // In all other instances display both buttons
    } else {
        nextButton.classList.remove('hidden')
        previousButton.classList.remove('hidden')
        submitButton.classList.add('hidden')
    }
}

function validateEntry() {
    let inputs = forms[currentStep].querySelectorAll('.form-input')

    // Start but disabling continue button
    nextButton.setAttribute('disabled', true)
    submitButton.setAttribute('disabled', true)

    setButtonPermissions(inputs);

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', () => setButtonPermissions(inputs))
        inputs[i].addEventListener('blur', () => setButtonPermissions(inputs))
    }
}

function setButtonPermissions(inputs) {
    let hasEmptyInput = false

    for (let i = 0; i < inputs.length; i++) {

        if(inputs[i].type == "text" || inputs[i].type == "textarea" ) {
            if (isEmpty(inputs[i].value)) {
                hasEmptyInput = true;
            }
        }
        if (inputs[i].type == "radio") {
            if(inputs[i].checked){
                hasEmptyInput = false;
                break;
            }
            hasEmptyInput = true;
        }
    }

    if (hasEmptyInput) {
        nextButton.setAttribute('disabled', true)
        submitButton.setAttribute('disabled', true)
    } else {
        nextButton.removeAttribute('disabled')
        submitButton.removeAttribute('disabled')
    }
}

//TOGGLE Price
let planData = document.getElementsByClassName('plan-data')
let toggleSwitch = document.getElementById('toggle')
let addOnData = document.getElementsByClassName('add-on-data')

toggleSwitch.addEventListener('change', function (e){
    if (toggleSwitch.checked) {
        for (let i = 0; i < planData.length; i++) {
            let yearlyPlanPrice = (planData[i].querySelector('.plan-price').innerHTML) * 10
            planData[i].querySelector('.plan-price').innerHTML = yearlyPlanPrice

            let yearlyPeriod = planData[i].querySelector('.plan-duration')
            yearlyPeriod.innerHTML = "yr"
        }
        for (let i = 0; i < addOnData.length; i++) {
            let yearlyAddOn = (addOnData[i].querySelector('.add-on-price').innerHTML) * 10
            addOnData[i].querySelector('.add-on-price').innerHTML = yearlyAddOn

            let yearlyPeriodAddOns = addOnData[i].querySelector('.add-on-duration')
            yearlyPeriodAddOns.innerHTML = "yr"
        }
    }else {
        for (let i = 0; i < planData.length; i++) {
            let yearlyPlanPrice = (planData[i].querySelector('.plan-price').innerHTML) / 10
            planData[i].querySelector('.plan-price').innerHTML = yearlyPlanPrice

            let yearlyPeriod = planData[i].querySelector('.plan-duration')
            yearlyPeriod.innerHTML = "mo"
        }

        for (let i = 0; i < addOnData.length; i++) {
            let yearlyAddOn = (addOnData[i].querySelector('.add-on-price').innerHTML) / 10
            addOnData[i].querySelector('.add-on-price').innerHTML = yearlyAddOn

            let yearlyPeriodAddOns = addOnData[i].querySelector('.add-on-duration')
            yearlyPeriodAddOns.innerHTML = "mo"
        }
    }

    let checkedPlan = document.querySelector('input[name="plan"]:checked');
    let event = new Event('change')

    // Dispatch it.
    checkedPlan.dispatchEvent(event)

    let checkedAddOns = document.querySelectorAll('input[name="add-ons-checkbox"]:checked');
    for (let i = 0; i < checkedAddOns.length; i++){
        checkedAddOns[i].dispatchEvent(event)
    }
})

//SUMMARY

// PLAN INPUT
let planInput = document.querySelectorAll('.plan-input')

    for (let  i = 0; i < planInput.length; i++){
        planInput[i].addEventListener('change', function (e) {
            const selectedPlan = e.target.parentElement
            let confirmationPlan = document.querySelector('.confirmation-plan')
            const confirmationPeriod = document.querySelector('.confirmation-period')
            const confirmationPrice = document.querySelector('.confirmation-price')
            const confirmationPeriodAb = document.querySelector('.confirmation-period-ab')
            const planName = selectedPlan.querySelector('.plan-name')
            const planPrice = selectedPlan.querySelector('.plan-price')
            const planDuration = selectedPlan.querySelector('.plan-duration').innerHTML
            if (planDuration == 'mo') {
                confirmationPeriod.innerHTML = 'Monthly'
            } else{
                confirmationPeriod.innerHTML = 'Yearly'
            }
            confirmationPlan.innerHTML = planName.innerHTML
            confirmationPrice.innerHTML = planPrice.innerHTML
            confirmationPeriodAb.innerHTML = planDuration

            total()
        })
    }

// ADD ONS
let addOns = document.querySelectorAll('input[name="add-ons-checkbox"]');
    for(let i = 0; i < addOns.length; i++) {
        addOns[i].addEventListener('change', function (e) {
            const checkedAddOn = e.target
            let selectedAddOn = e.target.parentElement
            let confirmationAddOn = document.querySelector('.' + checkedAddOn.value)
            let confirmationAddOnName = confirmationAddOn.querySelector('.confirmation-add-ons-name')
            let confirmationAddOnPrice = confirmationAddOn.querySelector('.confirmation-add-ons-price')
            let confirmationAddOnPeriod = confirmationAddOn.querySelector('.confirmation-add-ons-period')

            if (checkedAddOn.checked) {
                let addOnName = selectedAddOn.querySelector('.add-on-name')
                let addOnPrice = selectedAddOn.querySelector('.add-on-price')
                let addOnPeriod = selectedAddOn.querySelector('.add-on-duration')
                confirmationAddOnName.innerHTML = addOnName.innerHTML
                confirmationAddOnPrice.innerHTML = addOnPrice.innerHTML
                confirmationAddOnPeriod.innerHTML = addOnPeriod.innerHTML
                confirmationAddOn.classList.remove("hidden")
            } else{
                confirmationAddOn.classList.add("hidden")
            }
            total()
        })
    }

// THANK YOU
const confirmButton = document.getElementById('confirm')
confirmButton.addEventListener('click', function (){
    const summaryPage = document.getElementById("summary")
    summaryPage.classList.add("hidden")

    const thankYouPage = document.getElementById('thanks')
    thankYouPage.classList.remove("hidden")

    const goBack = document.getElementById("back")
    goBack.classList.add("hidden")
    confirmButton.classList.add("hidden")
})

const changeBtn = document.getElementById('change-btn')
changeBtn.addEventListener('click', function (){

    // Hide current tab
    hideCurrentTab()

    // Show next tab
    currentStep = 1
    showOtherTab()

    updateStatusDisplay()
})


