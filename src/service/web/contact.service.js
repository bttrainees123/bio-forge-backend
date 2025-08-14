const contactModel=require("../../model/contact.model")
const contactService={}
contactService.add=async(request)=>{
   await contactModel.create(request.body)
}
module.exports=contactService