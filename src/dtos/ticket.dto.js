export default class TicketDTO {
  fromModel(model) {
    return {
      id: model.id,
      code: model.code,
      date: model.purchase_datetime,
      products: model.products,
      purcharser: model.purcharser,
    };
  }

  fromData(data) {
    const products = data.products.map((product) => ({
      product_id: product.product_id,
      amount: Number(product.amount),
    }));

    return {
      products,
      purchaser: data.email.trim(),
    };
  }
}
