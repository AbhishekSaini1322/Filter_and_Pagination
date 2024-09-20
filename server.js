const express = require("express")
const app = express();
const fs = require("fs")
const bfj = require("bfj")
const path = "./productsdata.json"
var productsList = [];
bfj
    .read(path)
    .then((config) => {
        productsList = config["products"];
    })
    .catch((error) => {
        console.log(error);
    });

app.set('views', 'views');
app.set('view engine', 'ejs');

app.get("/products", (req, res) => {
    var limit = 22;
    var skip = 0;
    var currentresult = 0;
    var result;
    var total = parseInt(productsList.length);
    var totalpage = Math.ceil(total / limit);
    var pagination = true;
    var products=productsList;
    var categoryvalue=req.query.category
    var brandvalue= req.query.brand

    if(brandvalue && categoryvalue ){
        products=products.filter(item=>item.category==categoryvalue && item.brand==brandvalue )
    }else{
        if(categoryvalue ){
            products=products.filter(item => item.category == categoryvalue)
        }
    
        if(brandvalue){
            products=products.filter(item =>item.brand==brandvalue)
        }
    }
    total = products.length
    totalpage = Math.ceil(total / limit);

    if (!req.query.skip) {
        if (limit < total) {
            currentresult = limit
            result = products.slice(0, currentresult)
        }
        else {
            currentresult = parseInt(total)
            result = products.slice(0, currentresult)
        }
    } else {
        skip = parseInt(req.query.skip);
        if (req.query.pz) {
            var pz = req.query.pz
            page = req.query.pz;
            console.log(skip);

        }
        if (total - skip > limit) {
            currentresult = limit + skip;
            result = products.slice(skip, currentresult)
            console.log(currentresult);

        } else {
            currentresult = total
            result = products.slice(skip, parseInt(total))
        }
    }
    skip = skip + limit;
    if (currentresult == total) {
        pagination = false;
    }

    var categories = [...new Set(productsList.map(item => item.category))]
    var uniquebrand= [...new Set(productsList.map(item => item.brand))];
    
    if(categoryvalue||brandvalue){
         categories = [...new Set(products.map(item => item.category))];
         uniquebrand= [...new Set(products.map(item => item.brand))];
    }
    
    res.render("products", {
        data: result,
        limit: limit,
        skip: skip,
        currentresult,
        pagination: pagination,
        totalpage,
        categories,
        categoryvalue,
        brandvalue,
        uniquebrand,
    
    })

})




app.listen(4000, (req, res) => {
    console.log("server connected at port 4000")
})