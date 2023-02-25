const express=require('express')
const path=require('path')
const firstmiddleware=async(req,res,next)=>{
    console.log("first")
    next()
}
const secondmiddleware=async(req,res,next)=>{
    console.log("second")
    next()
}
const thirdmiddleware=async(req,res,next)=>{
    console.log("third")
    next()
}



module.exports=[express.urlencoded({limit: '50mb'},{extended: false}),
express.static(path.join(process.cwd(), 'public')),
express.static(path.join(process.cwd(), 'build')),firstmiddleware,secondmiddleware,thirdmiddleware,]
