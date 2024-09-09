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
}
