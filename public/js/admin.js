

const deleteProduct = (btn) => {
    const btn_parent_Nod = btn.parentNode
    const productId = btn_parent_Nod.querySelector("[name = productId]").value
    const csrfToken = btn_parent_Nod.querySelector("[name = _csrf]").value
    fetch(`/admin/product/${productId}`,{
        method: "DELETE",
        headers: {
            "csrf-Token" : csrfToken,
        }
    }).then((res)=>{
        console.log(res.json())
        btn_parent_Nod.parentNode.parentNode.remove();
    }).catch(err => { console.log(err)} )
    console.log({productId,csrfToken})
}