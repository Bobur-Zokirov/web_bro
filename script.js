window.addEventListener("DOMContentLoaded", () => {
    const next = document.querySelector("#next");
    const prev = document.querySelector("#prev");
    const dropDown = document.querySelector("#dropdown-menu");
    const productsContainer = document.querySelector("#products");

    let products = [];
    let categories = [];

    //======================== Pagination functions =================
    let skip = 0;

    next.addEventListener("click", () => {
        if (skip == 80) {
            return
        }
        skip += 20
        fetchData(skip)
        creataCard()
    })

    prev.addEventListener("click", () => {
        if (skip == 0) {
            return
        }
        skip -= 20
        fetchData(skip)
        creataCard()
    })


    //====================== Data Fetching functions =================
    async function fetchData(num) {
        const res = await fetch(`https://dummyjson.com/products?limit=20&skip=${num}`)
        const data = await res.json()

        products.splice(0, products.length)
        data.products.forEach(p => products.push(p))
    }


    async function creataCard() {
        await fetchData(skip)
        productsContainer.innerHTML = products.map(p => (
            `
                <div class="card col-3 p5 df" style="width: 18rem;">
                    <img src=${p.thumbnail} class="card-img-top" alt="..." style="object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${p.title.slice(0, 20)}</h5 >

                        <p class="card-text">${p.description.slice(0, 46)}...</p>

                        <p class="footer">
                            <btn class="btn btn-secondary">Details...</btn>
                            <span id="price">${p.price}$</span>
                            <button type="submit" class="btn btn-success add-btn">Add</button>
                        </p>
                    </div >
                </div >
            `
        )).join("")

        const allcards = document.querySelectorAll(".card")
        addToCart(allcards)
    }

    creataCard()

    //==================== Fetching categories ======================

    async function fetchCategory() {
        const res = await fetch("https://dummyjson.com/products/categories")
        const data = await res.json()
        categories.splice(0, categories.length)
        data.forEach(c => categories.push(c))
    }


    //==================== Filter products by category ======================
    async function fetchFilteredProducts(category) {
        const res = await fetch(`https://dummyjson.com/products/category/${category}`)
        const data = await res.json()
        products.splice(0, products.length)
        data.products.forEach(p => products.push(p))
        productsContainer.innerHTML = products.map(p => (
            `
                <div class="card col-3 p5 df" style="width: 18rem;">
                    <img src=${p.thumbnail} class="card-img-top" alt="..." style="object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${p.title}</h5 >

                        <p class="card-text">${p.description.slice(0, 36)}...</p>

                        <p class="footer">
                            <btn class="btn btn-secondary">Details...</btn>
                            <span id="price">${p.price}$</span>
                            <button type="submit" class="btn btn-success add-btn">Add</button>
                        </p>
                    </div >
                </div >
            `
        )).join("")

        const allcards = document.querySelectorAll(".card")
        addToCart(allcards)
    }


    //==================== Create filter element in HTML  ===================

    async function createFilter() {
        await fetchCategory()
        dropDown.innerHTML = categories.map(c => (
            `
            <li><a class="dropdown-item" href="#">${c}</a></li>
        
        `
        )).join("")
        let allCategories = document.querySelectorAll(".dropdown-item")

        allCategories.forEach(c => {
            c.addEventListener("click", async () => {
                const cat = c.innerText
                await fetchFilteredProducts(cat)
            })
        })
    }

    createFilter()


    //======================== Cart actions  =========================
    const cart = document.querySelector("#cart");
    const openCart = document.querySelector("#openCart");
    const closeCart = document.querySelector("#close-btn");
    const cartItems = document.querySelector("#cart-items");

    openCart.addEventListener("click", () => {
        cart.style.right = "0"
    })

    closeCart.addEventListener("click", () => {
        cart.style.right = "-100%";
    })


    //======================== Add to Cart  ==========================

    let productsInCart = [];

    function addToCart(arr) {
        arr.forEach((card, index) => {
            card.addEventListener("click", (e) => {
                if (e.target.classList.contains("add-btn")) {
                    const product = {
                        id: products[index].id,
                        title: products[index].title,
                        image: products[index].thumbnail,
                        price: +products[index].price,
                    }

                    const li = document.createElement("li")
                    li.innerHTML = `
                        <div class="cart-item">
                            <img src="${product.image}" />
                            <div>
                                
                                <span>${product.price}$</span>
                            </div>
                        </div>
                        `
                    if (!productsInCart.some((p) => p.id === product.id)) {
                        cartItems.appendChild(li)
                        productsInCart.push(product)
                        console.log(productsInCart)
                    } else {
                        alert("product is already in the cart")
                    }

                }
            })
        })
    }





























    // function fetchData(skip) {
    //     fetch(`https://dummyjson.com/products?limit=20&skip=${skip}`)
    //         .then(res => { return res.json() })
    //         .then(data => {
    //             console.log(data)
    //             data.products.forEach(product => {
    //                 const markup = `<li><a href="#">${product.title}</a> <span>${product.price}</span></li>`
    //                 productsContainer.insertAdjacentHTML("beforeend", markup)

    //             });
    //         })
    //         .catch(err => console.log(err))

    // }

    // fetchData(skip)

})