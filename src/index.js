import {Request} from "./request"
import {UI} from "./ui"
//Elementleri Secme
const form = document.querySelector("#employee-form")
const nameInput = document.querySelector("#name")
const departmentInput = document.querySelector("#department")
const salaryInput = document.querySelector("#salary")
const employeeList = document.querySelector("#employees")
const updateEmployeeButton = document.querySelector("#update")

//Request Objesini Olusturma
const request = new Request("http://localhost:3000/employees")

//UI Objesini Olusturma
const ui = new UI()

//Json bilgileri alacak degisken tanimlama
let updateState = null

//Eventleri Baslatma
eventListeners()

function eventListeners(){
    //Tum eventler
    document.addEventListener("DOMContentLoaded" , getAllEmployees)
    form.addEventListener("submit" , addEmployee)
    employeeList.addEventListener("click",updateOrDelete)
    updateEmployeeButton.addEventListener("click", updateEmployee)
}

function getAllEmployees(){
    //Get request 
    request.get()
    .then(employees => {
        ui.addEmployeesToUI(employees)
    })
    .catch(err => console.log(err))

}

function addEmployee(e){

    //Employee ekleme
    const employeeName = nameInput.value.trim()
    const employeeDepartment = departmentInput.value.trim()
    const employeeSalary = salaryInput.value.trim()

    if(employeeName === "" || employeeDepartment === "" || employeeSalary === ""){

        alert("Lutfen tum alanlari doldurunuz....")

    }
    else{

        request.post({name:employeeName,department:employeeDepartment,salary:Number(employeeSalary)})
        .then(employee => {
            ui.addEmployeeToUI(employee) // Arayuze employee data gonderme.
        })
        .catch(err => console.log(err))
    }

    ui.clearInputs()
    e.preventDefault()
}

function updateOrDelete(e){

    
    if(e.target.id === "delete-employee"){
        //Silme
        deleteEmployee(e.target)

    }
    else if(e.target.id === "update-employee"){
        //Guncelleme
        updateEmployeeController(e.target.parentElement.parentElement)
    }

}

function deleteEmployee(targetEmployee){
    //data silme
    const id = targetEmployee.parentElement.previousElementSibling.previousElementSibling.textContent
    request.delete(id)
        .then(employee => ui.deleteEmployeeToUI(targetEmployee.parentElement.parentElement))
        .catch(err => console.log(err))

}

function updateEmployeeController(targetEmployee){
    //data update
    ui.toggleUpdateButton(targetEmployee)

    if(updateState === null){

        updateState = {
            updateId: targetEmployee.children[3].textContent,
            updateParent: targetEmployee
        }
    }
    else{
        updateState = null
    }

}

function updateEmployee(){
    //data update
    if(updateState){
        //Guncelleme
        const data = {
            name:nameInput.value.trim(),
            department:departmentInput.value.trim(),
            salary:Number(salaryInput.value.trim())
        }
            request.put(updateState.updateId,data)
            .then(uppdatedEmployee =>{

                ui.updateEmployeeOnUI(uppdatedEmployee,updateState.updateParent)
                

            })
            .catch(err => console.log(err))
        

    }

}