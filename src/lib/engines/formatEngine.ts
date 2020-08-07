import { Option } from "react-multi-select-component/dist/lib/interfaces";

export class FormatEngine {
  formatCSV(data: Array<Array<string>>): Array<any> {
    let newProducts = [];
    const productKeys = data[0];
    console.info(productKeys);
    for (let i = 1; i < data.length; i++) {
      let productData = data[i];
      let newProduct: any = {};
      for (let x = 0; x < productData.length; x++) {
        let propName = productKeys[x].replace(/\s/g, '_');
        newProduct[propName] = productData[x].trim()
      }
      newProducts.push(newProduct);
    }
    return newProducts;
  }

  getFilterOptions(data: Array<Array<string>>): Array<Option>{
    let headers = data[0];
    return headers.map((h: string) => {
      return {
        value: h.replace(/\s/g, '_'),
        label: h,
        disabled: false
      }
    })
  }
}