import { request, response } from "express";

const insertProperty = (request, response)=>{
    return 0
}

const updateProperty = (request, response)=>{
    return 0
}

const deleteProperty = (request, response)=>{
    return 0
}

const findAllProperties = (request, response)=>{
    return 0
}

const findAllByUserProperties = (request, response)=>{
    return 0
}

const findOneProperty = (request, response)=>{
    return 0
}


const formProperty =(request,response)=>{
    console.log("Mostrando el Formulario para la creación de una nueva propiedad")
    response.render("property/create",{ 
        page: "New Property",
        showHeader: true
    })
}

export {
    insertProperty,
    updateProperty,
    deleteProperty,
    findAllProperties,
    findAllByUserProperties,
    findOneProperty,
    formProperty
}