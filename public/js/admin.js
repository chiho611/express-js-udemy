const deleteButton = (btn) => {
    console.log(btn)
    const productId = btn.parentNode.querySelector('[name=productId]').value
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value
    const productElement = btn.closest('article');

    fetch('product/' + productId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            return result.json();
        })
        .then(data => {
            console.log(data)
            productElement.parentNode.removeChild(productElement);
        })
        .catch(err => {
            console.log(err)
        })
}