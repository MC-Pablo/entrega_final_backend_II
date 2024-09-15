export default class TicketDTO {
  fromModel (model) {
      return {
          id: model.id,
          code: model.code,
          date: model.purchase_datetime,
          products: model.products,
          purcharser: model.purcharser
      }
  }

  fromData(data) {
      const products = []

      data.products.map(elem => products.push({product_id: elem.product, amount: Number(elem.quantity)}))


      return {
          products,
          purchaser: data.email
      };
    }
};