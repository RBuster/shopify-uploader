import * as _ from 'lodash';

export class FormatEngine {
  formatCSV(data) {
    let newProducts = [];
    const productKeys = data[0];
    console.info(productKeys);
    for (let i = 1; i < data.length; i++) {
      let productData = data[i];
      let newProduct = {};
      for (let x = 0; x < productData.length; x++) {
        let propName = productKeys[x].replace(/\s/g, '').replace('#', 'Num');
        newProduct[propName] = productData[x].trim()
      }
      newProducts.push(newProduct);
    }
    return newProducts;
  }

  //change to return product headers
  getFilterOptions(data){
    return Object.keys(data[0]).map((h) => {
      return {
        value: h,
        label: h,
        disabled: false
      }
    })
  }

  convertProducts(data){
    let cleanItems = this.formatCSV(data);
    console.info(cleanItems);
    return _.compact(_.map(cleanItems, (item) => {
      if(item.ProductName){
        return {
          title: item.ProductName,
          barcode: item.UPC,
          sku: item.ItemNum,
          description: item.ProductDescription,
          imgURL: item.ProductImageURL
        }
      }
    }));
  }
}